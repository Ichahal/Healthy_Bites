import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
  TouchableOpacity,
  Platform,
  Share,
} from "react-native";
import { db } from "./firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import YoutubePlayer from "react-native-youtube-iframe";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const RecipeDetailsScreen = ({ route, navigation }) => {
  const { recipeId, recipeName, recipeUser, user } = route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserRecipe, setIsUserRecipe] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Add isFavorite state

  const bannerRef = useRef(null);

  useForeground(() => {
    if (Platform.OS === "ios" && bannerRef.current) {
      bannerRef.current.load();
    }
  });

  useFocusEffect(
    useCallback(() => {
      fetchRecipeDetails(); // Refetch data when the screen comes into focus
    }, [route.params])
  );

  useEffect(() => {
    if (user) {
      console.log("Recipe ID:", recipeId);
      console.log("User ID:", user.uid);
    }
  }, [recipeId, user]);

  useEffect(() => {
    checkIfFavorite();
    checkIfFollowing(); // Check if following on component mount
  }, [recipeId, user]);

  const fetchRecipeDetails = async () => {
    setLoading(true);
    try {
      if (recipeId) {
        const docRef = doc(db, "Recipes", recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
          setIsUserRecipe(true);
        } else {
          setIsUserRecipe(false);
          await fetchRecipeFromAPI(recipeName);
        }
      } else {
        await fetchRecipeFromAPI(recipeName);
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      Alert.alert(
        "Error",
        "Failed to fetch recipe details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (user && recipeId) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsFavorite(userData.favoriteRecipes?.includes(recipeId));
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    }
  };

  const checkIfFollowing = async () => {
    if (user && recipeUser?.uid) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsFollowing(userData.following?.includes(recipeUser.uid) || false);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    }
  };


  const handleFavorite = async () => {
    if (user && recipeId) {
      try {
        const userRef = doc(db, "users", user.email.toLowerCase());
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const newFavoriteStatus = !isFavorite;
          
          setIsFavorite(newFavoriteStatus);
  
          // const recipeName = "Recipe Name Here"; // Replace this with the actual recipe name
  
          await updateDoc(userRef, {
            favoriteRecipes: newFavoriteStatus
              ? arrayUnion({ id: recipeId, name: recipeName })
              : arrayRemove({ id: recipeId, name: recipeName }),
          });
  
          console.log(
            `Recipe${newFavoriteStatus ? " added to" : " removed from"} favorites`
          );
        } else {
          console.error("User document does not exist.");
          Alert.alert(
            "Error",
            "User document does not exist. Please ensure your user profile is properly set up."
          );
        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
        Alert.alert(
          "Error",
          "Failed to update favorite status. Please try again later."
        );
      }
    }
  };

  const navigateToRecipeUserProfile = () => {
    navigation.navigate("Recipe User Profile Screen", { user: recipeUser });
  };

  const fetchRecipeFromAPI = async (recipeName) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`
      );
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0]);
      } else {
        setRecipe(null);
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      Alert.alert("Error", "Failed to fetch recipe details from API.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.navigate("Home");
  };

  const renderIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (recipe && recipe[`strIngredient${i}`]) {
        ingredients.push(
          `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`] || ""}`
        );
      }
    }
    return ingredients.length > 0 ? (
      ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>
          {ingredient}
        </Text>
      ))
    ) : (
      <Text style={styles.noIngredientsText}>No ingredients available.</Text>
    );
  };

  const renderCustomIngredients = (ingredients) => {
    return ingredients.length > 0 ? (
      ingredients.map((ingredientObj, index) => (
        <Text key={index} style={styles.ingredient}>
          {ingredientObj.amount} {ingredientObj.ingredient}
        </Text>
      ))
    ) : (
      <Text style={styles.noIngredientsText}>No ingredients available.</Text>
    );
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  }, []);

  const shareRecipe = async () => {
    try {
      const result = await Share.share({
        title: `Check out this recipe: ${recipe.strMeal || recipe.title}`,
        message: `Hey! Check out this awesome recipe: ${
          recipe.strMeal || recipe.title
        }\n\nIngredients: ${recipe.ingredients
          ?.map((ing) => `${ing.amount} ${ing.ingredient}`)
          .join(", ")}\n\nInstructions: ${
          recipe.strInstructions || recipe.description
        }\n\nWatch on YouTube: ${recipe.strYoutube || ""}`,
        url: recipe.strYoutube || "",
      });

      if (result.action === Share.sharedAction) {
        console.log("Recipe shared successfully");
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  const processText = (text) => {
    if (!text) return "";

    const processedText = text.replace(/\r\n/g, "\n\n");

    // Add an extra newline at the end of each paragraph
    return processedText.replace(/(\n\n)/g, "$1\n");
  };

  const renderParagraphs = (text) => {
    const processedText = processText(text);
    const paragraphs = processedText.split(/\n\s*\n/);

    return paragraphs.map((para, index) => (
      <Text key={index} style={styles.instructions}>
        {para}
        {"\n"}
      </Text>
    ));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {recipe ? (
            <>
              <View style={styles.header}>
                <Image
                  source={{
                    uri: recipe.strMealThumb || recipe.photoURL || recipe.photo,
                  }}
                  style={styles.image}
                />
                <Text style={styles.title}>
                  {recipe.strMeal || recipe.title}
                </Text>
                <View style={styles.meta}>
                  <TouchableOpacity
                    onPress={handleFavorite}
                    style={styles.iconButton}
                  >
                    <FontAwesome
                      name={isFavorite ? "heart" : "heart-o"}
                      size={24}
                      color="#ff6347"
                    />
                  </TouchableOpacity>
                  <Text style={styles.metaText}>5 stars</Text>
                  <Text style={styles.metaText}>{recipe.time || "15 min"}</Text>

                  <TouchableOpacity
                    onPress={shareRecipe}
                    style={styles.iconButton}
                  >
                    <FontAwesome name="share-alt" size={24} color="#ff6347" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={navigateToRecipeUserProfile}>
                <View style={styles.userContainer}>
                  <Image
                    source={{
                      uri:
                        recipeUser?.profilePictureUrl ||
                        "https://via.placeholder.com/150",
                    }}
                    style={styles.userImage}
                  />
                  <Text style={styles.username}>
                    {recipeUser?.name || "Anonymous"}
                  </Text>
                  {user &&
                  user.uid &&
                  recipeUser &&
                  recipeUser.uid &&
                  user.uid !== recipeUser.uid ? (
                    <TouchableOpacity
                      onPress={handleFollowPress}
                      style={styles.followButton}
                    >
                      <Text style={styles.followButtonText}>
                        {isFollowing ? "Following" : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Edit Recipe Screen", { recipeId })
                        }
                        style={styles.followButton}
                      >
                        <Text style={styles.followButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("DeleteUserRecipe", { recipeId })
                        }
                        style={[
                          styles.followButton,
                          { marginLeft: 10, backgroundColor: "#ff0000" },
                        ]}
                      >
                        <Text style={styles.followButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.instructionsContainer}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                {renderParagraphs(recipe.strInstructions || recipe.description)}
              </View>

              {recipe.strYoutube && (
                <View style={styles.youtubeContainer}>
                  <YoutubePlayer
                    height={230}
                    play={playing}
                    videoId={extractVideoId(recipe.strYoutube)}
                    onChangeState={onStateChange}
                  />
                </View>
              )}
            </>
          ) : (
            <View style={styles.noRecipeContainer}>
              <Text style={styles.noRecipeText}>
                Recipe not found. Please check back later.
              </Text>
            </View>
          )}

          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients
              ? renderCustomIngredients(recipe.ingredients)
              : renderIngredients(recipe)}
          </View>
        </ScrollView>
        <View style={styles.smallBanner}>
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            ref={bannerRef}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 20,
  },
  smallBanner: {
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  header: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 8,
  },
  metaText: {
    fontSize: 18,
    color: "#ff6347",
  },
  actionButtons: {
    flexDirection: "row",
    marginVertical: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  followButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ingredientsContainer: {
    marginVertical: 8,
  },
  youtubeContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 24,
  },
  noIngredientsText: {
    fontSize: 16,
    color: "#888",
  },
  instructionsContainer: {
    marginVertical: 8,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
  noRecipeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecipeText: {
    fontSize: 18,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeDetailsScreen;
