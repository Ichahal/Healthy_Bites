import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation, useIsFocused } from "@react-navigation/native";
import EditProfileScreen from "./EditProfileScreen"; // Ensure this screen is imported
import { signout, auth } from "./firebase/auth";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import CreateRecipeScreen from "./CreateRecipeScreen";
import { select } from "../Healthy_Bites/firebase/firestore";

const Profile = ({ user, setUser }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Recipes"); // State to track the active tab

  useEffect(() => {
    const loadUserData = async () => {
      const userDetails = await select(auth.currentUser.email.toLowerCase(), 'users');
      setUser(userDetails);
    };

    if (isFocused) {
      loadUserData();
    }
  }, [isFocused]);

  const handleCreateRecipe = () => {
    navigation.navigate("CreateRecipe", { user }); // Navigate to the CreateRecipe screen
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }} // Placeholder image URL
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileUsername}>@{user.username}</Text>
          <Text style={styles.profileDescription}>
            {user.description || "User description goes here. This is a placeholder for the user's bio or presentation."}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile", { user })}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createRecipeButton} // Style for the Create Recipe button
            onPress={handleCreateRecipe}
          >
            <Text style={styles.createRecipeButtonText}>Create Recipe</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>recipes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>250</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
        {/* <View style={styles.tabsContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Recipes</Text>
          <Text style={styles.tab}>Favorites</Text>
        </View> */}
        {/* Other profile content */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => handleTabChange("Recipes")}>
            <Text style={[styles.tab, activeTab === "Recipes" && styles.activeTab]}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange("Favorites")}>
            <Text style={[styles.tab, activeTab === "Favorites" && styles.activeTab]}>Favorites</Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Recipes" ? (
          // Render recipes grid here
          <Text>Recipes Grid</Text>
        ) : (
          // Render favorites grid here
          <Text>Favorites Grid</Text>
        )}
        {/* Add the grid of recipes here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

const ProfileScreen = ({ user, setUser }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const navigation = useNavigation();

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signout(); 
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      });
    } catch (error) {
      console.error("Logout Error:", error);
      // Handle any logout errors here
    }
  };

  return (
    <MenuProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            options={{
              headerRight: () => (
                <Menu>
                  <MenuTrigger>
                    <Text style={styles.menuText}>⋮</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      onSelect={handleLogout}
                      customStyles={optionStyles}
                      text="Logout"
                    />
                  </MenuOptions>
                </Menu>
              ),
              headerShown: true,
              headerTitle: "",
              headerLeft: () => null,
            }}
          >
            {(props) => <Profile {...props} user={currentUser} setUser={setCurrentUser} />}
          </Stack.Screen>
          <Stack.Screen
            name="EditProfile"
            options={{ headerShown: true }}
          >
            {(props) => <EditProfileScreen {...props} user={currentUser} setUser={setCurrentUser} />}
          </Stack.Screen>
          <Stack.Screen
            name="Home"
            options={{ headerShown: true }}
          >
            {(props) => <HomeScreen {...props} user={currentUser} setUser={setCurrentUser} />}
          </Stack.Screen>
          <Stack.Screen
            name="CreateRecipe"
            options={{ headerShown: true }}
          >
            {(props) => <CreateRecipeScreen {...props} user={user} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

const optionStyles = {
  optionText: {
    fontSize: 16,
  },
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 40, 
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6347",
  },
  profileUsername: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
  },
  tab: {
    fontSize: 16,
    color: "#666",
    padding: 8,
  },
  activeTab: {
    color: "#ff6347",
    borderBottomWidth: 2,
    borderBottomColor: "#ff6347",
  },
  menuButton: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 24,
    color: "#ff6347",
    marginRight: 16,
  },
  createRecipeButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 8,
    marginTop: 10, // Adjust the margin top as needed
  },
  createRecipeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProfileScreen;
