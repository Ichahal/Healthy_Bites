import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBarComponent = ({ onSearch, onQueryChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("category");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    fetchFilters();
  }, []);

const fetchFilters = async () => {
  try {
    const categoryResponse = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const categoryData = await categoryResponse.json();
    setCategories(categoryData.categories);

    const areaResponse = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const areaData = await areaResponse.json();
    setAreas(areaData.meals);

    const ingredientResponse = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    const ingredientData = await ingredientResponse.json();
    const sortedIngredients = ingredientData.meals.sort((a, b) =>
      a.strIngredient.localeCompare(b.strIngredient)
    );
    setIngredients(sortedIngredients);
  } catch (error) {
    console.error("Error fetching filters:", error);
  }
};


const handleSearchPress = async () => {
  await onSearch(
    searchQuery,
    selectedCategory,
    selectedArea,
    selectedIngredients
  );
  setFilterVisible(false); // Close modal after search
  handleResetFilters(); // Reset filters after search
};


  const toggleFilterTab = (tab) => {
    setSelectedTab(tab);
    setSelectedCategory("");
    setSelectedArea("");
    setSelectedIngredients([]);
  };

const toggleFilter = (filterType) => {
  switch (selectedTab) {
    case "ingredients":
      const index = selectedIngredients.indexOf(filterType);
      if (index === -1) {
        setSelectedIngredients([...selectedIngredients, filterType]);
      } else {
        setSelectedIngredients(
          selectedIngredients.filter((item) => item !== filterType)
        );
      }
      break;
    case "category":
      setSelectedCategory(selectedCategory === filterType ? "" : filterType);
      break;
    case "area":
      setSelectedArea(selectedArea === filterType ? "" : filterType);
      break;
    default:
      break;
  }
};


  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedArea("");
    setSelectedIngredients([]);
    setFilterVisible(false);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          onQueryChange(text);
        }}
      />
      <TouchableOpacity style={styles.iconButton} onPress={handleSearchPress}>
        <Ionicons name="search" size={24} color="#FF6347" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setFilterVisible(true)}
      >
        <Ionicons name="options-outline" size={24} color="#FF6347" />
      </TouchableOpacity>

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  selectedTab === "category" && styles.selectedTabItem,
                ]}
                onPress={() => toggleFilterTab("category")}
              >
                <Text style={styles.tabText}>Category</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  selectedTab === "area" && styles.selectedTabItem,
                ]}
                onPress={() => toggleFilterTab("area")}
              >
                <Text style={styles.tabText}>Area</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  selectedTab === "ingredients" && styles.selectedTabItem,
                ]}
                onPress={() => toggleFilterTab("ingredients")}
              >
                <Text style={styles.tabText}>Ingredients</Text>
              </TouchableOpacity>
            </View>

            {selectedTab === "category" && (
              <ScrollView style={styles.tabContent}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.strCategory}
                    style={[
                      styles.filterOption,
                      selectedCategory === category.strCategory &&
                        styles.selectedFilterOption,
                    ]}
                    onPress={() => toggleFilter(category.strCategory)}
                  >
                    <Text style={styles.filterOptionText}>
                      {category.strCategory}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {selectedTab === "area" && (
              <ScrollView style={styles.tabContent}>
                {areas.map((area) => (
                  <TouchableOpacity
                    key={area.strArea}
                    style={[
                      styles.filterOption,
                      selectedArea === area.strArea &&
                        styles.selectedFilterOption,
                    ]}
                    onPress={() => toggleFilter(area.strArea)}
                  >
                    <Text style={styles.filterOptionText}>{area.strArea}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {selectedTab === "ingredients" && (
              <ScrollView style={styles.tabContent}>
                {ingredients.map((ingredient) => (
                  <TouchableOpacity
                    key={ingredient.strIngredient}
                    style={[
                      styles.filterOption,
                      selectedIngredients.includes(ingredient.strIngredient) &&
                        styles.selectedFilterOption,
                    ]}
                    onPress={() => toggleFilter(ingredient.strIngredient)}
                  >
                    <Text style={styles.filterOptionText}>
                      {ingredient.strIngredient}
                    </Text>
                    {selectedIngredients.includes(ingredient.strIngredient) && (
                      <Ionicons name="checkbox" size={20} color="#FF6347" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.modalButtonContainer}>
              <Button
                title="Reset"
                onPress={handleResetFilters}
                color="#FF6347"
              />
              <Button
                title="Apply Filters"
                onPress={() => {
                  setFilterVisible(false);
                  handleSearchPress();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
    justifyContent: "space-around",
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6347",
  },
  tabText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#555",
  },
  tabContent: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedFilterOption: {
    backgroundColor: "#FF6347",
  },
  filterOptionText: {
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
});

export default SearchBarComponent;
