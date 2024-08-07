import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import Register from "./Register";
import MainScreen from "./MainScreen";
import RecipeDetailsScreen from "./recipeDetailsScreen";
import SearchScreen from "./SearchScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";
import RecipeUserProfileScreen from "./RecipeUserProfileScreen";
import ProfileScreen from "./ProfileScreen";
import ContactUs from "./ContactUs";
import EditRecipeScreen from "./EditRecipeScreen"
import CommunitySearchScreen from "./CommunitySearchScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [splashVisible, setSplashVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (splashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerLeft: null,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Recipe Details Screen"
          component={RecipeDetailsScreen}
        />
        <Stack.Screen name="Search Screen" component={SearchScreen} />
        <Stack.Screen name="Community Search Screen" component={CommunitySearchScreen} />
        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen
          name="Recipe User Profile Screen"
          component={RecipeUserProfileScreen}
        />
        <Stack.Screen name="UserProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Contact Us" component={ContactUs} />
        <Stack.Screen name="Edit Recipe Screen" component={EditRecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
