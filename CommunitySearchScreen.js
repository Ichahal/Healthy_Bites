import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchRecipeComponent from "./SearchRecipeComponent";
import { useRoute } from "@react-navigation/native";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  query as firestoreQuery,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const CommunitySearchScreen = () => {
  const route = useRoute();
  const { initialQuery, user } = route.params || {};
  const navigation = useNavigation();

  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchQuery, setLastSearchQuery] = useState(initialQuery || "");
  const [loading, setLoading] = useState(false);
  const resultsPerPage = 10;

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = filteredResults.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async (query) => {
    setLastSearchQuery(query);
    setLoading(true);
    try {
      let q;
      if (query.trim() === "") {
        q = firestoreQuery(collection(db, "Recipes"));
      } else {
        q = firestoreQuery(
          collection(db, "Recipes"),
          where("title", ">=", query),
          where("title", "<=", query + "\uf8ff")
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedRecipes = [];
      for (const doc of querySnapshot.docs) {
        const recipeData = doc.data();
        const userData = await fetchUserProfile(recipeData.userId); // Fetch user profile for each recipe
        fetchedRecipes.push({
          id: doc.id,
          ...recipeData,
          user: userData, // Attach user data
        });
      }

      setSearchResults(fetchedRecipes);
      setFilteredResults(fetchedRecipes);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching search results:", error);
      Alert.alert(
        "Error",
        "Failed to fetch search results. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (query) => {
    setLastSearchQuery(query);
    const filtered = searchResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(filtered);
    setCurrentPage(1);
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate("Recipe Details Screen", {
      recipeId: recipe.id,
      recipeName: recipe.title,
      recipeUser: recipe.user,
      user,
    });
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

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      handleSearch(""); // Fetch all results on first load if no initialQuery
    }
  }, [initialQuery]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search recipes..."
            value={lastSearchQuery}
            onChangeText={handleQueryChange}
            onSubmitEditing={() => handleSearch(lastSearchQuery)}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleSearch(lastSearchQuery)}
          >
            <Ionicons name="search" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6347" />
        ) : (
          <ScrollView>
            {currentResults.length > 0 ? (
              currentResults.map((recipe) => (
                <SearchRecipeComponent
                  key={recipe.id}
                  recipe={{
                    image: recipe.photoURL || recipe.photo,
                    title: recipe.title,
                    description: recipe.instructions
                      ? recipe.instructions.slice(0, 100) + "..."
                      : "No instructions available.",
                    time: recipe.time || "Unknown",
                    difficulty: recipe.difficulty || "Unknown",
                    rating: recipe.rating || "Unknown",
                  }}
                  onPress={() => handleRecipePress(recipe)}
                />
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No match found for "{lastSearchQuery}", press search or change
                  input.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
        {totalPages > 1 && (
          <View style={styles.pagination}>
            {[...Array(totalPages)].map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  styles.pageNumber,
                  currentPage === index + 1 && styles.activePage,
                ]}
                onPress={() => handlePageChange(index + 1)}
              >
                <Text
                  style={[
                    styles.pageNumberText,
                    currentPage === index + 1 && styles.activePageText,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#000",
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  pageNumber: {
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activePage: {
    backgroundColor: "#FF6347",
  },
  pageNumberText: {
    fontSize: 16,
    color: "#666",
  },
  activePageText: {
    color: "#fff",
  },
});

export default CommunitySearchScreen;
