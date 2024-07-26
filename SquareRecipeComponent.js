import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const SquareRecipeComponent = ({ recipe, onPress }) => {
  const maxTitleLength = 25;

  const truncateTitle = (title, maxLength) => {
    if (!title) return "";
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };


  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>
        {truncateTitle(recipe.title, maxTitleLength)}
      </Text>
      {/* <Text style={styles.details}>{recipe.details}</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#666",
  },
});

export default SquareRecipeComponent;
