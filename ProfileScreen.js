import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation, useIsFocused } from "@react-navigation/native";
import EditProfileScreen from "./EditProfileScreen";
import RecipeDetailsScreen from "./recipeDetailsScreen"; 
import { signout, auth } from "./firebase/auth";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import CreateRecipeScreen from "./CreateRecipeScreen";
import { db } from "../Healthy_Bites/firebaseConfig";
import { collection, getDocs, query } from 'firebase/firestore';
import SquareRecipeComponent from "./SquareRecipeComponent";


const Profile = ({ user, setUser }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Recipes");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    user.profilePictureUrl || ""
  );

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          // Query the "ownRecipes" subcollection of the current user
          const q = query(collection(db, `users/${user.email}/ownRecipes`));
          const querySnapshot = await getDocs(q);
          const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
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

  const navigateToRecipeDetails = (recipeId, recipeName) => {
    navigation.navigate("RecipeDetailsScreen", { recipeId, recipeName, user });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.profileImage}
              />
            )}
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>
            <Text style={styles.profileDescription}>
              {user.description ||
                "User description goes here. This is a placeholder for the user's bio or presentation."}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("Edit Profile", { user, setUser })}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createRecipeButton}
          onPress={() => navigation.navigate("Create Recipe", { user })}
        >
          <Text style={styles.createRecipeButtonText}>Create Recipe</Text>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>Recipes</Text>
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
            <Text
              style={[styles.tab, activeTab === "Recipes" && styles.activeTab]}
            >
              Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Favorites")}>
            <Text
              style={[
                styles.tab,
                activeTab === "Favorites" && styles.activeTab,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Recipes" ? (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SquareRecipeComponent
                recipe={{
                  image: item.photo || "https://via.placeholder.com/150",
                  title: item.title,
                  details: item.time || "5 stars | 15min",
                }}
                onPress={() => navigateToRecipeDetails(item.id, item.title)}
              />
            )}
            numColumns={2}
            contentContainerStyle={styles.recipeGrid}
            ListEmptyComponent={() => (
              <View style={styles.centeredView}>
                <Text>No recipes found.</Text>
              </View>
            )}
            ListFooterComponent={
              loading && <ActivityIndicator size="large" color="#ff6347" />
            }
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
                      style={styles.menuOption}
                    />
                  </MenuOptions>
                </Menu>
              ),
              headerShown: true,
              headerTitle: "",
              headerLeft: () => null,
            }}
          >
            {(props) => (
              <Profile {...props} user={currentUser} setUser={setCurrentUser} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Edit Profile" options={{ headerShown: true }}>
            {(props) => (
              <EditProfileScreen
                {...props}
                user={currentUser}
                setUser={setCurrentUser}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Home" options={{ headerShown: true }}>
            {(props) => (
              <HomeScreen
                {...props}
                user={currentUser}
                setUser={setCurrentUser}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Create Recipe" options={{ headerShown: true }}>
            {(props) => <CreateRecipeScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="Recipe Details Screen" component={RecipeDetailsScreen} />
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
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6347",
    marginBottom: 8,
  },
  profileUsername: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: "#666",
    // textAlign: "center",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  createRecipeButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  createRecipeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff6347",
    paddingBottom: 8,
  },
  recipeGrid: {
    paddingHorizontal: 8,
  },
  recipeCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 8,
    flex: 1,
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  recipeDetails: {
    padding: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  recipeTime: {
    fontSize: 12,
    color: "#999",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 20,
    paddingHorizontal: 10,
    fontWeight: "bold",
    padding: 10,
  },
  menuOption: {
    textAlign: "center",
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 8,
  },
});

export default ProfileScreen;
