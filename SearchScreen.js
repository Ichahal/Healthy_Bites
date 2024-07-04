import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SearchRecipeComponent from "./SearchRecipeComponent";
import SearchBarComponent from "./SearchBarComponent";

const SearchScreen = ({ route, navigation }) => {
  const initialSearchResults = route?.params?.searchResults || [];
  const [searchResults, setSearchResults] = useState(initialSearchResults);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const resultsPerPage = 10;

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = searchResults.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async (query) => {
    setLastSearchQuery(query);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      if (data.meals) {
        const newSearchResults = data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          photo: meal.strMealThumb,
          instructions: meal.strInstructions,
        }));
        setSearchResults(newSearchResults);
        setCurrentPage(1); // Reset page to 1 when new results are fetched
      } else {
        setSearchResults([]); // Handle no results case
        setCurrentPage(1); // Reset page to 1 when no results are found
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      setSearchResults([]); // Handle error case by showing no results
      setCurrentPage(1); // Reset page to 1 when error occurs
    }
  };

  return (
    <View style={styles.container}>
      <SearchBarComponent onSearch={handleSearch} />
      <ScrollView>
        {currentResults.length > 0 ? (
          currentResults.map((recipe) => (
            <SearchRecipeComponent
              key={recipe.id}
              recipe={{
                image: recipe.photo,
                title: recipe.title,
                description: recipe.instructions
                  ? recipe.instructions.slice(0, 100) + "..."
                  : "No instructions available.",
                author: "Unknown", // Add author if available
                time: "Unknown", // Add time if available
                difficulty: "Unknown", // Add difficulty if available
                rating: "Unknown", // Add rating if available
              }}
            />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
                No recipes found for "{lastSearchQuery}" .
                { "\n"}
                Please try another
              search term.
              </Text>
              
          </View>
        )}
      </ScrollView>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
    backgroundColor: "#FD5D69",
  },
  pageNumberText: {
    fontSize: 16,
    color: "#666",
  },
  activePageText: {
    color: "#fff",
  },
});

export default SearchScreen;
