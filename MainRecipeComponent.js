import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MainRecipeComponent = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.details}>{recipe.details}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default MainRecipeComponent;
