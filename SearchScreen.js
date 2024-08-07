import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SearchRecipeComponent from "./SearchRecipeComponent";
import SearchBarComponent from "./SearchBarComponent";
import { useRoute } from "@react-navigation/native";

const SearchScreen = () => {
  const route = useRoute();
  const {
    searchResults: initialSearchResults,
    query: initialQuery,
    selectedCategory: initialCategory,
    selectedArea: initialArea,
    selectedIngredients: initialIngredients,
  } = route.params || {};

  const [searchResults, setSearchResults] = useState(
    initialSearchResults || []
  );
  const [filteredResults, setFilteredResults] = useState(
    initialSearchResults || []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchQuery, setLastSearchQuery] = useState(initialQuery || "");
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

  const handleSearch = async (query, category, area, ingredients) => {
    setLastSearchQuery(query);
    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

      if (category) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } else if (area) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
      } else if (ingredients.length > 0) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients.join(
          ","
        )}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.meals) {
        const newSearchResults = data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          photo: meal.strMealThumb,
          instructions: meal.strInstructions,
        }));
        setSearchResults(newSearchResults);
        setFilteredResults(newSearchResults);
        setCurrentPage(1); // Reset page to 1 when new results are fetched
      } else {
        setSearchResults([]); // Handle no results case
        setFilteredResults([]);
        setCurrentPage(1); // Reset page to 1 when no results are found
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      setSearchResults([]); // Handle error case
      setFilteredResults([]);
      setCurrentPage(1); // Reset page to 1 when an error occurs
    }
  };

  const handleQueryChange = (query) => {
    setLastSearchQuery(query);
    const filtered = searchResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to the first page of the filtered results
  };

  return (
    <View style={styles.container}>
      <SearchBarComponent
        onSearch={handleSearch}
        onQueryChange={handleQueryChange}
        initialQuery={initialQuery}
        initialCategory={initialCategory}
        initialArea={initialArea}
        initialIngredients={initialIngredients}
      />
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
              No match found for "{lastSearchQuery}", press search or change
              input.
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

export default SearchScreen;
