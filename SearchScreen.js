import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import SearchRecipeComponent from "./SearchRecipeComponent";
import SearchBarComponent from "./SearchBarComponent";

const SearchScreen = ({ route }) => {
  const { recipes } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        <FlatList
          data={paginatedRecipes}
          renderItem={({ item }) => <SearchRecipeComponent recipe={item} />}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <View style={styles.paginationContainer}>
              {Array.from({ length: totalPages }, (_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pageNumber,
                    currentPage === index + 1 && styles.activePageNumber,
                  ]}
                  onPress={() => setCurrentPage(index + 1)}
                >
                  <Text style={styles.pageNumberText}>{index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  pageNumber: {
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  activePageNumber: {
    backgroundColor: "#ff6347",
  },
  pageNumberText: {
    color: "#000",
  },
});

export default SearchScreen;
