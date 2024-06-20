import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const MainRecipeComponent = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: recipe.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.details}>{recipe.details}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 16,
    marginTop: 8,
    color: "#666",
  },
});

export default MainRecipeComponent;
