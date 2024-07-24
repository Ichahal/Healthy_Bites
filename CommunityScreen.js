import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "./firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#ff6347";
const SECONDARY_COLOR = "#f7d8d8";
const TEXT_COLOR = "#333";
const INACTIVE_TAB_COLOR = "#FFC1C1";
const FALLBACK_IMAGE_URL = "https://www.themealdb.com/images/media/meals/ebvuir1699013665.jpg";

const CommunityScreen = ({ user }) => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Latest");

  useEffect(() => {
    fetchRecipes();
  }, [activeTab]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Recipes"));
      const fetchedRecipes = [];
      for (const doc of querySnapshot.docs) {
        const recipeData = doc.data();
        const userData = await fetchUserProfile(recipeData.userId);
        fetchedRecipes.push({
          id: doc.id,
          ...recipeData,
          user: userData,
        });
      }
      const sortedRecipes = sortRecipes(fetchedRecipes, activeTab);
      setRecipes(sortedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      Alert.alert("Error", "Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.warn(`User with ID ${userId} not found`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const sortRecipes = (recipes, criteria) => {
    switch (criteria) {
      case "AI Picked":
        return recipes.sort((a, b) => b.likes - a.likes); // Example sorting logic
      case "Latest":
        return recipes.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "Following":
        return recipes.sort((a, b) => new Date(a.date) - new Date(b.date));
      default:
        return recipes;
    }
  };

  const navigateToRecipeDetails = (recipeId, recipeName, recipeUser) => {
    navigation.navigate("Recipe Details Screen", {
      recipeId,
      recipeName,
      recipeUser,
      user,
    });
  };

  const RecipeImage = ({ uri }) => {
    const [imageUri, setImageUri] = useState(uri);

    const handleError = () => {
      setImageUri(FALLBACK_IMAGE_URL);
    };

    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.recipeImage}
        onError={handleError}
      />
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeContainer}
      onPress={() => navigateToRecipeDetails(item.id, item.title, item.user)}
    >
      <RecipeImage uri={item.photo} />
      <View style={styles.recipeInfo}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profilePictureUrl }}
            style={styles.userProfileImage}
          />
          <View>
            <Text style={styles.userName}>@{item.user.name}</Text>
            <Text style={styles.userTime}>{item.time} ago</Text>
          </View>
        </View>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDetails}>{item.description}</Text>
        <View style={styles.recipeFooter}>
          <Text style={styles.recipeTime}>⏱ {item.time} min</Text>
          <Text style={styles.recipeLikes}>❤️ {item.likes}</Text>
        </View>
      </View>
      <View style={styles.recipeBottomBorder} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.heading}>Community</Text>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Notifications", "No new notifications")
              }
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={PRIMARY_COLOR}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchScreen")}
            >
              <Ionicons name="search" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity on onPress={() => setActiveTab("AI Picked")}>
            <Text
              style={[
                styles.tab,
                activeTab === "AI Picked" && styles.activeTab,
              ]}
            >
              AI Picked
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Latest")}>
            <Text
              style={[styles.tab, activeTab === "Latest" && styles.activeTab]}
            >
              Latest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Following")}>
            <Text
              style={[
                styles.tab,
                activeTab === "Following" && styles.activeTab,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={PRIMARY_COLOR}
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>
                {activeTab === "AI Picked"
                  ? "No AI Picked recipes found."
                  : activeTab === "Following"
                  ? "No Following recipes found."
                  : "No recipes found. Please try again later."}
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginBottom:32,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    paddingLeft: 24,
  },
  icons: {
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    paddingVertical: 8,
  },
  tab: {
    fontSize: 16,
    fontWeight: "bold",
    color: INACTIVE_TAB_COLOR,
    marginHorizontal: 16,
  },
  activeTab: {
    color: PRIMARY_COLOR,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  recipeContainer: {
    borderRadius: 24,
    marginBottom: 32,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#fff9f8",
  },
  recipeImage: {
    width: "100%",
    height: 200,
  },
  recipeInfo: {
    padding: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  userTime: {
    fontSize: 12,
    color: "#999",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: TEXT_COLOR,
  },
  recipeDetails: {
    fontSize: 12,
    marginBottom: 8,
    color: TEXT_COLOR,
  },
  recipeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeTime: {
    fontSize: 12,
    color: TEXT_COLOR,
  },
  recipeLikes: {
    fontSize: 12,
    color: TEXT_COLOR,
  },
  flatListContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  emptyText: {
    textAlign: "center",
    color: INACTIVE_TAB_COLOR,
    fontSize: 16,
  },
});

export default CommunityScreen;
