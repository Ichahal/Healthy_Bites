import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import MainRecipeComponent from './MainRecipeComponent';
import SquareRecipeComponent from './SquareRecipeComponent';
import SearchBarComponent from './SearchBarComponent';

export default function HomeScreen({ user, setUser }) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainRecipe, setMainRecipe] = useState(null);
  const [yourRecipes, setYourRecipes] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setUser(user); 
    }
  }, [isFocused]);

  useEffect(() => {
    fetchRecipes('potato'); 
  }, []);

  const fetchRecipes = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`,
        {
          headers: {
            Authorization: `Bearer 5e209556-a259-438e-a84f-696acfe64826`, // Include your API key here
          },
        }
      );
      const apiRecipes = response.data.data.recipes;

      const randomMainRecipeIndex = Math.floor(Math.random() * apiRecipes.length);
      const randomMainRecipe = apiRecipes[randomMainRecipeIndex];

      const randomYourRecipesIndexes = [];
      while (randomYourRecipesIndexes.length < 2) {
        const randomIndex = Math.floor(Math.random() * apiRecipes.length);
        if (!randomYourRecipesIndexes.includes(randomIndex)) {
          randomYourRecipesIndexes.push(randomIndex);
        }
      }
      const randomYourRecipes = randomYourRecipesIndexes.map((index) => apiRecipes[index]);

      setRecipes(apiRecipes);
      setMainRecipe({
        image: randomMainRecipe.image_url,
        title: randomMainRecipe.title,
        details: `${randomMainRecipe.publisher} | ${randomMainRecipe.cooking_time}min`,
        publisher: randomMainRecipe.publisher,
        cooking_time: randomMainRecipe.cooking_time,
        ingredients: randomMainRecipe.ingredients,
        instructions: randomMainRecipe.instructions,
      });
      setYourRecipes(
        randomYourRecipes.map((recipe) => ({
          image: recipe.image_url,
          title: recipe.title,
          details: `${recipe.publisher} | ${recipe.cooking_time}min`,
          publisher: recipe.publisher,
          cooking_time: recipe.cooking_time,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await fetchRecipes(searchQuery);
    navigation.navigate('SearchScreen', { mainRecipe });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <Text style={styles.greeting}>Hi! {user.name}</Text>
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        {mainRecipe && (
          <MainRecipeComponent
            recipe={mainRecipe}
            onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: mainRecipe })}
          />
        )}

        <View style={styles.featuredRecipesContainer}>
          <Text style={styles.sectionTitle}>Featured Recipes</Text>
          {recipes.length > 0 ? (
            <FlatList
              horizontal
              data={Array.from({ length: 20 }, (_, index) => index).map((index) => recipes[index % recipes.length])}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SquareRecipeComponent
                  recipe={{
                    image: item.image_url,
                    title: item.title,
                    details: `${item.publisher} | ${item.cooking_time}min`,
                    publisher: item.publisher,
                    cooking_time: item.cooking_time,
                    ingredients: item.ingredients,
                    instructions: item.instructions,
                  }}
                  onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: item })}
                />
              )}
              contentContainerStyle={styles.featuredRecipesList}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>

        <Text style={styles.sectionTitle}>Your Recipes</Text>
        <View style={styles.yourRecipes}>
          {yourRecipes.map((recipe, index) => (
            <SquareRecipeComponent
              key={index}
              recipe={recipe}
              onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe })}
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
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  featuredRecipesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  featuredRecipesList: {
    paddingHorizontal: 16,
  },
  yourRecipes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});
