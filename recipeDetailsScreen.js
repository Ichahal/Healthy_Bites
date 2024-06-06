import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const RecipeDetailsScreen = ({ recipe }) => {
  const {
    image,
    title,
    rating,
    views,
    userImage,
    username,
    details,
    ingredients,
    isFollowing,
    cookTime,
  } = recipe || {
    image:
      "https://www.eatloveeats.com/wp-content/uploads/2022/03/Creamy-Broccoli-Chicken-Lasagna-Featured.jpg", // Placeholder image URL
    title: "Broccoli Lasagna",
    rating: 5,
    views: 2273,
    userImage: "https://via.placeholder.com/40", // Placeholder user image URL
    username: "travelfood_",
    details:
      "Layers of tender broccoli, creamy ricotta, and melted cheese, baked to golden perfection. A wholesome twist on the classic comfort food favorite.",
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.meta}>
          <Text style={styles.rating}>⭐ {rating}</Text>
          <Text style={styles.views}>{views} views</Text>
        </View>
      </View>
      <View style={styles.userContainer}>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <Text style={styles.username}>@{username}</Text>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.cookTime}>{cookTime}</Text>
        <Text style={styles.detailsHeader}>Details</Text>
        <Text style={styles.details}>{details}</Text>
      </View>
      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            {ingredient}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
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
  followButton: {
    backgroundColor: "#FF6F61",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 80,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
});

export default RecipeDetailsScreen;
