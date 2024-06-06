import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import RecipeDetailsScreen from './recipeDetailsScreen'; // Import the RecipeDetailsScreen component

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecipeDetailsScreen" component={RecipeDetailsScreen} /> {/* Add RecipeDetailsScreen to the stack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
