import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MainRecipeComponent = ({ recipe }) => {
  const navigation = useNavigation();

  const navigateToRecipeDetails = () => {
    navigation.navigate("RecipeDetailsScreen");
  };

  return (
    <TouchableOpacity
      onPress={navigateToRecipeDetails}
      style={styles.trendingRecipe}
    >
      <Image source={{ uri: recipe.image }} style={styles.trendingImage} />
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <Text style={styles.recipeDescription}>{recipe.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trendingRecipe: {
    marginBottom: 16,
  },
  trendingImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default MainRecipeComponent;
