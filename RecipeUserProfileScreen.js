import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { db } from "./firebaseConfig"; // Adjust the import path as necessary
import { collection, getDocs, query } from 'firebase/firestore';
import SquareRecipeComponent from "./SquareRecipeComponent"; // Adjust the import path as necessary

const RecipeUserProfileScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profilePictureUrl || "");

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          const q = query(collection(db, `users/${user.email}/ownRecipes`));
          const querySnapshot = await getDocs(q);
          const recipesData = querySnapshot.docs
            .filter((doc) => doc.id !== "initDoc") // Exclude the "initDoc" document
            .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRecipes(recipesData);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused && user && user.email) {
      loadRecipes();
    }
  }, [isFocused, user]);

const navigateToRecipeDetails = (recipeId, recipeName, recipeUser) => {
  navigation.navigate("Recipe Details Screen", {
    recipeId,
    recipeName,
    recipeUser: user,
  });
};

  const handleFollow = () => {
    // Implement follow functionality here
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.profileImage}
              />
            )}
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>
            <Text style={styles.profileDescription}>
              {user.description ||
                "User description goes here. This is a placeholder for the user's bio or presentation."}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>250</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SquareRecipeComponent
              recipe={{
                image: item.photo || item.photoURL,
                title: item.title,
                details: item.time || "5 stars | 15min",
              }}
              onPress={() => navigateToRecipeDetails(item.id, item.title)}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.recipeGrid}
          ListEmptyComponent={() => (
            <View style={styles.centeredView}>
              <Text>No recipes found.</Text>
            </View>
          )}
          ListFooterComponent={
            loading && <ActivityIndicator size="large" color="#ff6347" />
          }
        />
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
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6347",
    marginBottom: 8,
  },
  profileUsername: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  followButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  recipeGrid: {
    paddingHorizontal: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeUserProfileScreen;
