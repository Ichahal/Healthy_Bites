import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import EditProfileScreen from "./EditProfileScreen";
import RecipeDetailsScreen from "./recipeDetailsScreen";
import { signout, auth } from "./firebase/auth";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import CreateRecipeScreen from "./CreateRecipeScreen";
import { db } from "../Healthy_Bites/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import SquareRecipeComponent from "./SquareRecipeComponent";
import EditRecipeScreen from "./EditRecipeScreen";
import RecipeUserProfileScreen from "./RecipeUserProfileScreen";
import DeleteUserRecipe from "./DeleteUserRecipe";

const Profile = ({ user, setUser }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Recipes");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    user.profilePictureUrl || ""
  );

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          const q = query(collection(db, `users/${user.email}/ownRecipes`));
          const querySnapshot = await getDocs(q);
          const recipesData = querySnapshot.docs
            .filter((doc) => doc.id !== "initDoc")
            .map((doc) => ({
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

    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (user && user.email) {
          const userRef = doc(db, "users", user.email.toLowerCase());
          const userSnap = await getDoc(userRef);
    
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const favouriteRecipes = userData.favoriteRecipes || [];
            console.log("Favorite Recipes IDs:", favouriteRecipes);
            setFavorites(favouriteRecipes.map((favRecipe) => ({
              id: favRecipe.id,
              name: favRecipe.name
            })));
          } else {
            console.error("User document does not exist.");
          }
        }
      } catch (error) {
        console.error("Error loading favourite recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused && user && user.email) {
      if (activeTab === "Recipes") {
        loadRecipes();
      } else if (activeTab === "Favorites") {
        loadFavorites();
      }
    }
  }, [isFocused, user, activeTab]);

  const navigateToRecipeDetails = (recipeId, recipeName, recipeUser) => {
    navigation.navigate("Recipe Details Screen", {
      recipeId,
      recipeName,
      recipeUser: user,
    });
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
              style={[
                styles.tab,
                activeTab === "Recipes" && styles.activeTab,
                activeTab === "Recipes" && styles.activeTabColor,
              ]}
            >
              Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Favorites")}>
            <Text
              style={[
                styles.tab,
                activeTab === "Favorites" && styles.activeTab,
                activeTab === "Favorites" && styles.activeTabColor,
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
            renderItem={({ item }) => {
              console.log('Rendering item:', item);
              return (
                <SquareRecipeComponent
                  style={styles.recipecontainer}
                  recipe={{
                    image: item.photoURL || item.photo,
                    title: item.title,
                    details: item.time || "5 stars | 15min",
                  }}
                  onPress={() => navigateToRecipeDetails(item.id, item.title)}
                />
              );
            }}
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
          <FlatList
  data={favorites}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => {
    console.log('Rendering favorite item:', item);
    return (
      <View style={styles.favoriteItemContainer}>
        {/* Include an image if available */}
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.favoriteItemImage}
          />
        )}
        <Text style={styles.favoriteItemName}>{item.name}</Text>
      </View>
    );
  }}
  numColumns={2}
  contentContainerStyle={styles.recipeGrid}
  ListEmptyComponent={() => (
    <View style={styles.centeredView}>
      <Text>No favorites found.</Text>
    </View>
  )}
  ListFooterComponent={
    loading && <ActivityIndicator size="large" color="#ff6347" />
  }
/>

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
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout Error:", error);
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
          <Stack.Screen
            name="Recipe Details Screen"
            component={RecipeDetailsScreen}
          />
          <Stack.Screen
            name="Edit Recipe Screen"
            component={EditRecipeScreen}
          />
          <Stack.Screen
            name="Recipe User Profile Screen"
            component={RecipeUserProfileScreen}
          />
          <Stack.Screen
            name="DeleteUserRecipe"
            component={DeleteUserRecipe}
          />
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
    marginBottom: 32,
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
    marginBottom: 24,
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
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff6347",
  },
  activeTabColor: {
    color: "#ff6347",
  },
  recipeGrid: {
    marginHorizontal: 8,
    marginTop: 10,
    alignSelf: "center",
  },
  recipecontainer: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  favoriteItemContainer: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
  },
  favoriteItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  favoriteItemName: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 24,
    paddingHorizontal: 10,
    fontWeight: "bold",
    padding: 10,
  },
  menuOption: {
    textAlign: "center",
    padding: 12,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 8,
  },
});

export default ProfileScreen;
