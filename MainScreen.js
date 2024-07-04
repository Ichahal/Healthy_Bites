import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import CommunityScreen from "./CommunityScreen"; // Import CommunityScreen

const Tab = createBottomTabNavigator();

export default function MainScreen({ route }) {
  const { user } = route.params;
  const [currentUser, setCurrentUser] = useState(user);

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
    </Tab.Navigator>
  );
}
