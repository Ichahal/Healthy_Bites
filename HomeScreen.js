import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen(user) {

  const userName = user.user.name; // Replace with user's name or username
  const userCookingToday = "Pizza"; // Replace with user's cooking preference or dish

  const contributors = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ]; // Replace with contributors' image URLs

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hi! {userName}</Text>
      <Text style={styles.subtitle}>What are you cooking today?</Text>
      <View style={styles.tabContainer}>
        <Text style={[styles.tab, styles.activeTab]}>Breakfast</Text>
        <Text style={styles.tab}>Lunch</Text>
        <Text style={styles.tab}>Dinner</Text>
        <Text style={styles.tab}>Vegan</Text>
        <Text style={styles.tab}>D.</Text>
      </View>
      <View style={styles.trendingRecipe}>
        <Image
          source={{ uri: "https://via.placeholder.com/300" }} // Placeholder for trending recipe image
          style={styles.trendingImage}
        />
        <Text style={styles.recipeTitle}>Salami and cheese pizza</Text>
        <Text style={styles.recipeDescription}>
          This is a quick overview of the ingredients...
        </Text>
      </View>
      <View style={styles.yourRecipes}>
        <View style={styles.recipe}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // Placeholder for user recipe image
            style={styles.recipeImage}
          />
          <Text style={styles.recipeTitle}>{userCookingToday}</Text>
          <Text style={styles.recipeDescription}>5 stars | 15min</Text>
        </View>
        <View style={styles.recipe}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // Placeholder for user recipe image
            style={styles.recipeImage}
          />
          <Text style={styles.recipeTitle}>Tiramisu</Text>
          <Text style={styles.recipeDescription}>5 stars | 15min</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Top Contributors</Text>
      <View style={styles.topContributors}>
        {contributors.map((contributor, index) => (
          <Image
            key={index}
            source={{ uri: contributor }} // Placeholder for contributors' images
            style={styles.contributorImage}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    marginRight: 16,
    fontSize: 16,
    color: "#666",
  },
  activeTab: {
    color: "#ff6347",
  },
  trendingRecipe: {
    marginBottom: 16,
  },
  trendingImage: {
    width: "100%",
    height: 200,
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
  yourRecipes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recipe: {
    width: "48%",
  },
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  topContributors: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contributorImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
  },
});
