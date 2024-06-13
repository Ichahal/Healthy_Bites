import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function RecipeDetailScreen({ route }) {
  const { recipe } = route.params;
  const { image, title, details, publisher, cooking_time, ingredients = [], instructions = "No instructions available." } = recipe;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
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
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  details: {
    fontSize: 16,
    marginBottom: 16,
  },
  publisher: {
    fontSize: 16,
    marginBottom: 8,
  },
  cookingTime: {
    fontSize: 16,
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 16,
  },
});
