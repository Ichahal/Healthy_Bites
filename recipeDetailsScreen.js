import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;
  const { image, title, details, publisher, cooking_time, ingredients = [], instructions = "No instructions available." } = recipe;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>{details}</Text>
      <Text style={styles.publisher}>Publisher: {publisher}</Text>
      <Text style={styles.cookingTime}>Cooking Time: {cooking_time} minutes</Text>
      <Text style={styles.ingredientsTitle}>Ingredients</Text>
      <Text style={styles.ingredients}>{ingredients.length > 0 ? ingredients.join(', ') : 'No ingredients available.'}</Text>
      <Text style={styles.instructionsTitle}>Instructions</Text>
      <Text style={styles.instructions}>{instructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    paddingBottom: 100, 
  },
  header: {
    alignItems: "center",
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
  backButton: {
    backgroundColor: "#FF6F61",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
