import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

const RecipeDetailsScreen = ({ route, navigation }) => {
  const { recipeId, recipeName, user } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (recipeId) {
        try {
          const docRef = doc(db, `users/${user.email}/ownRecipes`, recipeId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRecipe(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching recipe details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
          const data = await response.json();
          setRecipe(data.meals[0]);
        } catch (error) {
          console.error("Error fetching recipe details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecipeDetails();
  }, [recipeId, recipeName]);

  const handleGoBack = () => {
    navigation.navigate("Home");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
    <ScrollView style={styles.container}>
      {recipe ? (
        <>
          <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Image source={require("./assets/back.png")} style={styles.backIcon} />
          </TouchableOpacity>
            <Image source={{ uri: recipe.strMealThumb || recipe.photo }} style={styles.image} />
            <Text style={styles.title}>{recipe.strMeal || recipe.title}</Text>
            <View style={styles.meta}>
              <Text style={styles.rating}>5 stars</Text>
              <Text style={styles.views}>{recipe.time || "15 min"}</Text>
            </View>
          </View>
          <View style={styles.userContainer}>
            <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.userImage} />
            <Text style={styles.username}>Author</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.cookTime}>Time: 30 minutes {recipe.strCookTime || recipe.time}</Text>
            <Text style={styles.detailsHeader}>Details</Text>
            <Text style={styles.details}>{recipe.strInstructions || recipe.description}</Text>
          </View>
          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Ingredients</Text>
            {Object.keys(recipe)
              .filter((key) => key.startsWith("strIngredient") && recipe[key])
              .map((key, index) => (
                <Text key={index} style={styles.ingredient}>
                  {recipe[key]}
                </Text>
              ))}
          </View>
        </>
      ) : (
        <Text>Recipe not found</Text>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left:0,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  backIcon: {
    width: 34,
    height: 34,
    // tintColor: "#FF6F61",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "center",
  },
  rating: {
    fontSize: 16,
    color: "#FF8C00",
    marginRight: 16,
  },
  views: {
    fontSize: 16,
    color: "#888888",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingLeft: 16,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  detailsContainer: {
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  cookTime: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 8,
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  ingredientsContainer: {
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
  },
});

export default RecipeDetailsScreen;
