import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { db } from "./firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

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

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          const q = query(collection(db, `users/${user.email}/ownRecipes`));
          const querySnapshot = await getDocs(q);
          const recipesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
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
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian");
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
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
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

  const userName = user.name;
  const navigation = useNavigation();

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
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Breakfast</Text>
          <Text style={styles.tab}>Lunch</Text>
          <Text style={styles.tab}>Dinner</Text>
          <Text style={styles.tab}>Vegan</Text>
          <Text style={styles.tab}>Dessert</Text>
        </View>
        {randomRecipeLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingIndicator} />
        ) : randomRecipe ? (
          <TouchableOpacity onPress={() => navigateToRecipeDetails(null, randomRecipe.strMeal)} style={styles.trendingRecipe}>
            <Image
              source={{ uri: randomRecipe.strMealThumb || "https://via.placeholder.com/150" }}
              style={styles.trendingImage}
            />
            <Text style={styles.recipeTitle}>{randomRecipe.strMeal}</Text>
            <Text style={styles.recipeDescription}>
              {randomRecipe.strInstructions.slice(0, 100)}...
            </Text>
          </TouchableOpacity>
        ) : (
          <Text>No random recipe found</Text>
        )}
        <Text style={styles.sectionTitle}>Your Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {loading ? (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingIndicator} />
          ) : (
            <View style={styles.recipeContainer}>
              {recipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} onPress={() => navigateToRecipeDetails(recipe.id, recipe.title)} style={styles.recipe}>
                  <Image
                    source={{ uri: recipe.photo || "https://via.placeholder.com/150" }}
                    style={styles.recipeImage}
                  />
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription}>{recipe.time || "5 stars | 15min"}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
        <Text style={styles.sectionTitle}>Vegetarian Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {vegetarianLoading ? (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingIndicator} />
          ) : (
            <View style={styles.recipeContainer}>
              {vegetarianRecipes.map((recipe) => (
                <TouchableOpacity key={recipe.idMeal} onPress={() => navigateToRecipeDetails(null, recipe.strMeal)} style={styles.recipe}>
                  <Image
                    source={{ uri: recipe.strMealThumb || "https://via.placeholder.com/150" }}
                    style={styles.recipeImage}
                  />
                  <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                </TouchableOpacity>
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
    marginBottom: 16,
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
    marginBottom: 16,
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
  trendingRecipe: {
    marginBottom: 16,
  },
  trendingImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  recipeContainer: {
    flexDirection: "row",
  },
  recipe: {
    width: 150,
    marginRight: 16,
  },
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    color: PRIMARY_COLOR,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
  },
  horizontalScroll: {
    marginBottom: 26,
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
});
