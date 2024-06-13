
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const SearchBarComponent = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  searchButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: "#ff6347",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SearchBarComponent;