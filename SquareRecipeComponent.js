import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const SquareRecipeComponent = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.details}>{recipe.details}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    width: 150,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  details: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SquareRecipeComponent;
