import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { db } from "./firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import SquareRecipeComponent from "./SquareRecipeComponent";
import MainRecipeComponent from "./MainRecipeComponent";
import SearchBarComponent from "./SearchBarComponent";


const PRIMARY_COLOR = "#FD5D69";
const SECONDARY_COLOR = "#FFA69E"; // Lighter shade of primary color

export default function HomeScreen({ user, setUser }) {
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vegetarianRecipes, setVegetarianRecipes] = useState([]);
  const [vegetarianLoading, setVegetarianLoading] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [randomRecipeLoading, setRandomRecipeLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          const q = query(collection(db, `users/${user.email}/ownRecipes`));
          const querySnapshot = await getDocs(q);
          const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRecipes(recipesData);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadVegetarianRecipes = async () => {
      setVegetarianLoading(true);
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian"
        );
        const data = await response.json();
        setVegetarianRecipes(data.meals);
      } catch (error) {
        console.error("Error loading vegetarian recipes:", error);
      } finally {
        setVegetarianLoading(false);
      }
    };

    const fetchRandomRecipe = async () => {
      setRandomRecipeLoading(true);
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        setRandomRecipe(data.meals[0]); // Assuming data.meals is an array and we take the first item
      } catch (error) {
        console.error("Error loading random recipe:", error);
      } finally {
        setRandomRecipeLoading(false);
      }
    };

    if (isFocused && user && user.email) {
      loadRecipes();
    }

    loadVegetarianRecipes();
    fetchRandomRecipe();
  }, [isFocused, user]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
      );
      const data = await response.json();
      if (data.meals) {
        const searchResults = data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          photo: meal.strMealThumb,
          instructions: meal.strInstructions,
        }));
        navigation.navigate("SearchScreen", { searchResults });
      } else {
        alert("No results found");
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  const userName = user.name;

  const navigateToRecipeDetails = (recipeId, recipeName) => {
    navigation.navigate("RecipeDetailsScreen", { recipeId, recipeName, user });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userName}!</Text>
          <Text style={styles.subtitle}>What are you cooking today?</Text>
        </View>
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Breakfast</Text>
          <Text style={styles.tab}>Lunch</Text>
          <Text style={styles.tab}>Dinner</Text>
          <Text style={styles.tab}>Vegan</Text>
          <Text style={styles.tab}>Dessert</Text>
        </View>
        <Text style={styles.sectionTitle}>Featured Recipe</Text>
        {randomRecipeLoading ? (
          <ActivityIndicator
            size="large"
            color={PRIMARY_COLOR}
            style={styles.loadingIndicator}
          />
        ) : randomRecipe ? (
          <MainRecipeComponent
            recipe={{
              image: randomRecipe.strMealThumb,
              title: randomRecipe.strMeal,
              details: randomRecipe.strInstructions.slice(0, 100) + "...",
            }}
            onPress={() => navigateToRecipeDetails(null, randomRecipe.strMeal)}
          />
        ) : (
          <Text>No random recipe found</Text>
        )}
        <Text style={styles.sectionTitle}>Your Recipes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color={PRIMARY_COLOR}
              style={styles.loadingIndicator}
            />
          ) : (
            <View style={styles.recipeContainer}>
              {recipes.map((recipe) => (
                <SquareRecipeComponent
                  key={recipe.id}
                  recipe={{
                    image: recipe.photo || "https://via.placeholder.com/150",
                    title: recipe.title,
                    details: recipe.time || "5 stars | 15min",
                  }}
                  onPress={() =>
                    navigateToRecipeDetails(recipe.id, recipe.title)
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
        <Text style={styles.sectionTitle}>Vegetarian Recipes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {vegetarianLoading ? (
            <ActivityIndicator
              size="large"
              color={PRIMARY_COLOR}
              style={styles.loadingIndicator}
            />
          ) : (
            <View style={styles.recipeContainer}>
              {vegetarianRecipes.map((recipe) => (
                <SquareRecipeComponent
                  key={recipe.idMeal}
                  recipe={{
                    image:
                      recipe.strMealThumb || "https://via.placeholder.com/150",
                    title: recipe.strMeal,
                  }}
                  onPress={() => navigateToRecipeDetails(null, recipe.strMeal)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    marginRight: 16,
    fontSize: 16,
    color: "#666",
  },
  activeTab: {
    color: PRIMARY_COLOR,
  },
  recipeContainer: {
    flexDirection: "row",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: PRIMARY_COLOR,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  horizontalScroll: {
    marginBottom: 16,
    marginTop: 8,
  },
});
