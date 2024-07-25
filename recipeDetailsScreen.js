import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import YoutubePlayer from "react-native-youtube-iframe";
import { FontAwesome } from "@expo/vector-icons";
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const RecipeDetailsScreen = ({ route, navigation }) => {
  const { recipeId, recipeName, recipeUser, user } = route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserRecipe, setIsUserRecipe] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playing, setPlaying] = useState(false);

  const bannerRef = useRef(null);

  useForeground(() => {
    if (Platform.OS === "ios" && bannerRef.current) {
      bannerRef.current.load();
    }
  });

  useEffect(() => {
    console.log("RecipeDetailsScreen mounted with params:", route.params);
    fetchRecipeDetails();
  }, [route.params]);

  useEffect(() => {
    checkIfFavorite();
  }, [recipeId, user]);

  const fetchRecipeDetails = async () => {
    setLoading(true);
    console.log("recipeId", recipeId);
    try {
      if (recipeId) {
        const docRef = doc(db, `Recipes`, recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
          setIsUserRecipe(true);
        } else {
          console.log("No such document, fetching from API.");
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
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setIsFavorite(userData.favoriteRecipes?.includes(recipeId));
      }
    }
  };

  const handleFavorite = async () => {
    if (user && recipeId) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const newFavoriteStatus = !isFavorite;
          setIsFavorite(newFavoriteStatus);

          await updateDoc(userRef, {
            favoriteRecipes: newFavoriteStatus
              ? arrayUnion(recipeId)
              : arrayRemove(recipeId),
          });

          console.log(
            `Recipe ${newFavoriteStatus ? "added to" : "removed from"} favorites`
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
    navigation.navigate("RecipeUserProfileScreen", { user: recipeUser });
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
        console.log("Recipe not found in API.");
        setRecipe(null); // Ensure recipe state is set appropriately
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
    return ingredients.map((ingredient, index) => (
      <Text key={index} style={styles.ingredient}>
        {ingredient}
      </Text>
    ));
  };

  const renderCustomIngredients = (ingredients) => {
    return ingredients.map((ingredientObj, index) => (
      <Text key={index} style={styles.ingredient}>
        {ingredientObj.amount} {ingredientObj.ingredient}
      </Text>
    ));
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const shareRecipe = async () => {
    try {
      const result = await Share.share({
        title: `Check out this recipe: ${recipe.strMeal || recipe.title}`,
        message: `Hey! Check out this awesome recipe: ${recipe.strMeal || recipe.title}\n\nIngredients: ${recipe.ingredients?.map(ing => `${ing.amount} ${ing.ingredient}`).join(', ')}\n\nInstructions: ${recipe.strInstructions || recipe.description}\n\nWatch on YouTube: ${recipe.strYoutube || ''}`,
        url: recipe.strYoutube || ''
      });

      if (result.action === Share.sharedAction) {
        console.log('Recipe shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {recipe ? (
            <>
              <View style={styles.header}>
                <Image
                  source={{ uri: recipe.strMealThumb || recipe.photo }}
                  style={styles.image}
                />
                <Text style={styles.title}>
                  {recipe.strMeal || recipe.title}
                </Text>
                <View style={styles.meta}>
                  <Text style={styles.rating}>5 stars</Text>
                  <Text style={styles.views}>{recipe.time || "15 min"}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={handleFavorite} style={styles.iconButton}>
                    <FontAwesome
                      name={isFavorite ? "heart" : "heart-o"}
                      size={24}
                      color="#FF6F61"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={shareRecipe} style={styles.iconButton}>
                    <FontAwesome name="share-alt" size={24} color="#FF6F61" />
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
                    user.uid !== recipeUser.uid && (
                      <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </TouchableOpacity>
              <View style={styles.detailsContainer}>
                <Text style={styles.cookTime}>
                  Time: {recipe.strCookTime || "30 minutes"}
                </Text>

                <Text style={styles.detailsHeader}>Details</Text>
                <Text style={styles.details}>
                  {recipe.strInstructions || recipe.description}
                </Text>
              </View>
              <View style={styles.midBanner}>
                <BannerAd
                  ref={bannerRef}
                  unitId={adUnitId}
                  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                />
              </View>
              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
                {recipeId
                  ? renderIngredients(recipe)
                  : recipe?.ingredients?.map((ingredient, index) => (
                      <Text key={index} style={styles.ingredient}>
                        {ingredient.amount} {ingredient.ingredient}
                      </Text>
                    ))}
              </View>
              <View style={styles.youtubeContainer}>
                {recipe.strYoutube ? (
                  <YoutubePlayer
                    height={300}
                    play={playing}
                    videoId={recipe.strYoutube.split("v=")[1]}
                    onChangeState={onStateChange}
                  />
                ) : (
                  <Text>No video available</Text>
                )}
              </View>
              <View style={styles.banner}>
                <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
              </View>
            </>
          ) : (
            <Text>Recipe not found.</Text>
          )}
        </ScrollView>
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
    flexGrow: 1,
    padding: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: "#FF6F61",
  },
  views: {
    fontSize: 16,
    color: "#757575",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  followButton: {
    backgroundColor: "#FF6F61",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  detailsContainer: {
    padding: 10,
  },
  cookTime: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  details: {
    fontSize: 16,
    marginTop: 5,
  },
  midBanner: {
    marginVertical: 10,
    alignItems: "center",
  },
  ingredientsContainer: {
    padding: 10,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  youtubeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  banner: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeDetailsScreen;