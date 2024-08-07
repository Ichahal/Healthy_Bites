import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SearchRecipeComponent = ({ recipe, onPress }) => {
  const navigation = useNavigation();

  const navigateToRecipeDetails = () => {
    navigation.navigate("Recipe Details Screen", {
      recipeId: recipe.id,
      recipeName: recipe.title,
    });
  }; 

  const handlePress = onPress || navigateToRecipeDetails;


  return (
    <TouchableOpacity onPress={handlePress} style={styles.recipeCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        <View style={styles.favoriteIcon}>
          <Text>❤️</Text>
        </View>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.recipeDescription}>{recipe.description}</Text>
        <Text style={styles.recipeTime}>Time: {recipe.time}</Text>
        <Text style={styles.recipeDifficulty}>
          Difficulty:{recipe.difficulty}
        </Text>
        <Text style={styles.recipeRating}>{recipe.rating} ⭐</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    height: 160,
  },
  imageContainer: {
    position: "relative",
    flex: 3,
    height: "100%",
    padding: 4,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
  },
  recipeInfo: {
    padding: 16,
    flex: 3,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recipeAuthor: {
    fontSize: 14,
    color: "#ff6347",
    marginBottom: 8,
  },
  recipeTime: {
    fontSize: 14,
    color: "#666",
  },
  recipeDifficulty: {
    fontSize: 14,
    color: "#666",
  },
  recipeRating: {
    fontSize: 14,
    color: "#666",
  },
});

export default SearchRecipeComponent;
