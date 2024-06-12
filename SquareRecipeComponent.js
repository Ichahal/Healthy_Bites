import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SquareRecipeComponent = ({ recipe }) => {
  const navigation = useNavigation();

  const navigateToRecipeDetails = () => {
    navigation.navigate("RecipeDetailsScreen");
  };

  return (
    <TouchableOpacity onPress={navigateToRecipeDetails} style={styles.recipe}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <Text style={styles.recipeDescription}>{recipe.details}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipe: {
    width: "48%",
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
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default SquareRecipeComponent;
