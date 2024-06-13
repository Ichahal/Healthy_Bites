import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MainRecipeComponent from "./MainRecipeComponent";
import SquareRecipeComponent from "./SquareRecipeComponent";
import SearchRecipeComponent from "./SearchRecipeComponent";
import SearchBarComponent from "./SearchBarComponent"; // Import the new component

export default function HomeScreen({ user, setUser }) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    if (isFocused) {
      setUser(user); // Ensure user state is updated
    }
  }, [isFocused]);

  const userName = user.name;
  const userCookingToday = "Pizza";

  const contributors = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const mainRecipe = {
    image:
      "https://www.eatloveeats.com/wp-content/uploads/2022/03/Creamy-Broccoli-Chicken-Lasagna-Featured.jpg",
    title: "Broccoli Lasagna",
    description: "This is a quick overview of the ingredients...",
    author: "Chef Josh Ryan",
    time: "45min",
    difficulty: "Easy",
    rating: 4,
    details: "5 stars | 15min",
  };

  const yourRecipes = [
    {
      image:
        "https://www.eatloveeats.com/wp-content/uploads/2022/03/Creamy-Broccoli-Chicken-Lasagna-Featured.jpg",
      title: userCookingToday,
      details: "5 stars | 15min",
    },
    {
      image:
        "https://www.eatloveeats.com/wp-content/uploads/2022/03/Creamy-Broccoli-Chicken-Lasagna-Featured.jpg",
      title: "Tiramisu",
      details: "5 stars | 15min",
    },
  ];

  const handleSearch = () => {
    navigation.navigate("SearchScreen", {
      recipes: Array(20).fill(mainRecipe), // Sending 10 instances of mainRecipe
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.greeting}>Hi! {userName}</Text>
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Breakfast</Text>
          <Text style={styles.tab}>Lunch</Text>
          <Text style={styles.tab}>Dinner</Text>
          <Text style={styles.tab}>Vegan</Text>
          <Text style={styles.tab}>D.</Text>
        </View>
        <MainRecipeComponent recipe={mainRecipe} />
        <View style={styles.yourRecipes}>
          {yourRecipes.map((recipe, index) => (
            <SquareRecipeComponent key={index} recipe={recipe} />
          ))}
        </View>
        <SearchRecipeComponent recipe={mainRecipe} />
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
  yourRecipes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
