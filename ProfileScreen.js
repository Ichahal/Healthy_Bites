import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation, useIsFocused } from "@react-navigation/native";
import EditProfileScreen from "./EditProfileScreen";
import { signout, auth } from "./firebase/auth";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import CreateRecipeScreen from "./CreateRecipeScreen";
import { db } from "../Healthy_Bites/firebaseConfig";
import { collection, getDocs, query } from 'firebase/firestore';

const Profile = ({ user, setUser }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Recipes");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profilePictureUrl || "");

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          // Query the "ownRecipes" subcollection of the current user
          const q = query(collection(db, `users/${user.email}/ownRecipes`));
          const querySnapshot = await getDocs(q);
          const recipesData = querySnapshot.docs.map(doc => doc.data());
          setRecipes(recipesData);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused && user && user.email) {
      loadRecipes();
    }
  }, [isFocused, user]);

  const handleCreateRecipe = () => {
    navigation.navigate("CreateRecipe", { user });
  };

  const renderRecipeItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.recipeCard} onPress={() => {/* Navigate to recipe detail */}}>
        <Image source={{ uri: item.photo }} style={styles.recipeImage} />
        <View style={styles.recipeDetails}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
          <Text style={styles.recipeTime}>Time: {item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (user.profilePictureUrl) {
      setProfileImage(user.profilePictureUrl);
    }
  }, [user.profilePictureUrl]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={{ uri: "https://via.placeholder.com/100"}} style={styles.profileImage} />
          )}
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileUsername}>@{user.username}</Text>
          <Text style={styles.profileDescription}>
            {user.description || "User description goes here. This is a placeholder for the user's bio or presentation."}
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfile", { user, setUser })}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createRecipeButton} onPress={handleCreateRecipe}>
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
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab("Recipes")}>
            <Text style={[styles.tab, activeTab === "Recipes" && styles.activeTab]}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Favorites")}>
            <Text style={[styles.tab, activeTab === "Favorites" && styles.activeTab]}>Favorites</Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Recipes" ? (
          <FlatList
            data={recipes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRecipeItem}
            numColumns={2}
            contentContainerStyle={styles.recipeGrid}
            ListEmptyComponent={() => (
              <View style={styles.centeredView}>
                <Text>No recipes found.</Text>
              </View>
            )}
            ListFooterComponent={loading && <ActivityIndicator size="large" color="#ff6347" />}
          />
        ) : (
          <Text>Favorites Grid</Text>
        )}
      </View>
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
    flex: 1,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeGrid: {
    paddingTop: 16,
  },
  recipeCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recipeImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeDetails: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  recipeTime: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
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

