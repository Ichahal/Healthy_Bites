import React, { useState, useCallback } from "react";
import { BackHandler, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from '@react-navigation/native';
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import CommunityScreen from "./CommunityScreen"; // Import CommunityScreen
import AboutScreen from "./AboutScreen"; // Import AboutScreen

const Tab = createBottomTabNavigator();

export default function MainScreen({ route, navigation }) {
  const { user } = route.params;
  const [currentUser, setCurrentUser] = useState(user);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused()) {
          Alert.alert(
            "Hold on!",
            "Are you sure you want to go back?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => BackHandler.exitApp() }
            ]
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
      >
        {(props) => <HomeScreen {...props} user={currentUser} setUser={setCurrentUser} />}
      </Tab.Screen>
      <Tab.Screen
        name="Community" // Add Community tab
        options={{ headerShown: false }}
      >
        {(props) => <CommunityScreen {...props} user={currentUser} setUser={setCurrentUser} />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
      >
        {(props) => <ProfileScreen {...props} user={currentUser} setUser={setCurrentUser} />}
      </Tab.Screen>
      <Tab.Screen
        name="About" // Add About tab
        options={{ headerShown: false }}
      >
        {(props) => <AboutScreen {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
