import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import RecipeDetailsScreen from "./recipeDetailsScreen";

export default function HomeScreen({ user }) {
  const userName = user.name;
  const userCookingToday = "Pizza";

  const navigation = useNavigation(); // Initialize navigation

  const navigateToRecipeDetails = () => {
    navigation.navigate("RecipeDetailsScreen"); // Navigate to RecipeDetailsScreen
  };

  const contributors = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
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
        <TouchableOpacity onPress={navigateToRecipeDetails} style={styles.trendingRecipe}>
          <Image
            source={{ uri: "https://www.eatloveeats.com/wp-content/uploads/2022/03/Creamy-Broccoli-Chicken-Lasagna-Featured.jpg" }}
            style={styles.trendingImage}
          />
          <Text style={styles.recipeTitle}>Broccoli Lasagna</Text>
          <Text style={styles.recipeDescription}>
            This is a quick overview of the ingredients...
          </Text>
        </TouchableOpacity>
        <View style={styles.yourRecipes}>
          <View style={styles.recipe}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeTitle}>{userCookingToday}</Text>
            <Text style={styles.recipeDescription}>5 stars | 15min</Text>
          </View>
          <View style={styles.recipe}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
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
              source={{ uri: contributor }}
              style={styles.contributorImage}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 40,
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
