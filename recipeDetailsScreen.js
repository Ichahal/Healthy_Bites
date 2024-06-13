import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";

const RecipeDetailsScreen = ({ navigation }) => {
  const recipe = {
    image: "https://www.eatloveeats.com/wp-content/uploads/2022/03/Creamy-Broccoli-Chicken-Lasagna-Featured.jpg", // Placeholder image URL
    title: "Broccoli Lasagna",
    rating: 5,
    views: 2273,
    userImage: "https://via.placeholder.com/40", // Placeholder user image URL
    username: "travelfood_",
    details: "Layers of tender broccoli, creamy ricotta, and melted cheese, baked to golden perfection. A wholesome twist on the classic comfort food favorite.",
    ingredients: [
      "9 lasagna noodles",
      "4 cups broccoli florets",
      "2 cups ricotta cheese",
      "2 cups shredded mozzarella cheese",
      "1/2 cup grated Parmesan cheese",
      "2 cloves garlic, minced",
      "1 teaspoon dried oregano",
      "1 teaspoon dried basil",
      "1/2 teaspoon salt",
    ],
    isFollowing: false,
    cookTime: "30min",
  };

  const handleGoBack = () => {
    navigation.navigate("Home"); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.rating}>⭐ {recipe.rating}</Text>
          <Text style={styles.views}>{recipe.views} views</Text>
        </View>
      </View>
      <View style={styles.userContainer}>
        <Image source={{ uri: recipe.userImage }} style={styles.userImage} />
        <Text style={styles.username}>@{recipe.username}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.cookTime}>{recipe.cookTime}</Text>
        <Text style={styles.detailsHeader}>Details</Text>
        <Text style={styles.details}>{recipe.details}</Text>
      </View>
      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            {ingredient}
          </Text>
        ))}
      </View>
      {/* <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity> */}
      {/* Add a dummy view to create space at the bottom */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

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

export default RecipeDetailsScreen;
