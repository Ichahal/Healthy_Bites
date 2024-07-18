import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { db } from "./firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import SquareRecipeComponent from "./SquareRecipeComponent";
import MainRecipeComponent from "./MainRecipeComponent";
import SearchBarComponent from "./SearchBarComponent";

const PRIMARY_COLOR = "#FD5D69";

export default function HomeScreen({ user, setUser }) {
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [randomRecipeLoading, setRandomRecipeLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Starter"); // Default active tab
  const [tabRecipes, setTabRecipes] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  const fetchRecipesByCategory = async (category) => {
    setTabLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = await response.json();
      setTabRecipes(data.meals || []);
    } catch (error) {
      console.error(`Error loading ${category} recipes:`, error);
    } finally {
      setTabLoading(false);
    }
  };

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
          console.log("Fetched recipes:", recipesData); // Log fetched recipes
          setRecipes(recipesData);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRandomRecipe = async () => {
      setRandomRecipeLoading(true);
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        setRandomRecipe(data.meals[0]);
      } catch (error) {
        console.error("Error loading random recipe:", error);
      } finally {
        setRandomRecipeLoading(false);
      }
    };

    if (isFocused && user && user.email) {
      loadRecipes();
    }

    fetchRecipesByCategory(activeTab);
    fetchRandomRecipe();
  }, [isFocused, user, activeTab]);

  const handleQueryChange = (text) => {
    setSearchQuery(text);
  };

const handleSearch = async (
  query,
  selectedCategory,
  selectedArea,
  selectedIngredients,
) => {
  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  if (selectedCategory) {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
  }
  if (selectedArea) {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
  }
  if (selectedIngredients.length > 0) {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredients.join(
      ","
    )}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.meals) {
      const searchResults = data.meals.map((meal) => ({
        id: meal.idMeal,
        title: meal.strMeal,
        photo: meal.strMealThumb,
        instructions: meal.strInstructions,
      }));
      navigation.navigate("Search Screen", {
        searchResults,
        query,
        selectedCategory,
        selectedArea,
        selectedIngredients,
      });
    } else {
      navigation.navigate("Search Screen", {
        searchResults: [],
        query,
        selectedCategory,
        selectedArea,
        selectedIngredients,
      });
    }
  } catch (error) {
    console.error("Error searching recipes:", error);
    navigation.navigate("Search Screen", {
      searchResults: [],
      query,
      selectedCategory,
      selectedArea,
      selectedIngredients,
    });
  }
};


  const userName = user.name;

  const navigateToRecipeDetails = (recipeId, recipeName) => {
    navigation.navigate("Recipe Details Screen", {
      recipeId,
      recipeName,
      user,
    });
  };

  const handleTabPress = (tabTitle) => {
    setActiveTab(tabTitle);
    if (tabTitle !== "Your Recipes") {
      fetchRecipesByCategory(tabTitle);
    } else {
      setTabRecipes(recipes); // Set user's own recipes as tabRecipes
    }
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
          onQueryChange={handleQueryChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
        />

        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              "Breakfast",
              "Starter",
              "Vegetarian",
              "Vegan",
              "Dessert",
              "Seafood",
              "Pasta",
              "Side",
              "Miscellaneous",
            ].map((tabTitle) => (
              <Text
                key={tabTitle}
                style={[
                  styles.tab,
                  activeTab === tabTitle && styles.activeTab,
                  tabTitle === "Miscellaneous" && { marginRight: 0 }, // Remove margin for the last tab
                ]}
                onPress={() => handleTabPress(tabTitle)}
              >
                {tabTitle}
              </Text>
            ))}
          </ScrollView>
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

        <Text style={styles.sectionTitle}>{activeTab} Recipes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {tabLoading ? (
            <ActivityIndicator
              size="large"
              color={PRIMARY_COLOR}
              style={styles.loadingIndicator}
            />
          ) : (
            <View style={styles.recipeContainer}>
              {tabRecipes.map((recipe) => (
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
    marginBottom: 0,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    paddingTop: 16,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});
