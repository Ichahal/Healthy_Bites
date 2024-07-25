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
} from "react-native";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import YoutubePlayer from "react-native-youtube-iframe";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const RecipeDetailsScreen = ({ route, navigation }) => {
  const { recipeId, recipeName, recipeUser, user } = route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserRecipe, setIsUserRecipe] = useState(false);
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
                  ? renderCustomIngredients(recipe.ingredients || [])
                  : renderIngredients(recipe)}
              </View>
              {recipe.strYoutube && (
                <View style={styles.youtubeContainer}>
                  <YoutubePlayer
                    height={250}
                    width={400}
                    play={playing}
                    videoId={recipe.strYoutube.split("v=")[1]}
                    onChangeState={onStateChange}
                  />
                </View>
              )}
            </>
          ) : (
            <Text>Recipe not found</Text>
          )}
          <View style={styles.smallBanner}>
            <BannerAd
              ref={bannerRef}
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: "#FF8C00",
    marginRight: 16,
  },
  views: {
    fontSize: 16,
    color: "#888888",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    color: "#333",
  },
  followButton: {
    marginLeft: "auto",
    backgroundColor: "#FF6F61",
    padding: 8,
    borderRadius: 4,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailsContainer: {
    marginBottom: 16,
  },
  cookTime: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FF6F61",
  },
  details: {
    fontSize: 16,
    color: "#333",
  },
  midBanner: {
    marginVertical: 16,
    alignItems: "center",
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FF6F61",
  },
  ingredient: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  youtubeContainer: {
    alignItems: "center",
  },
  smallBanner: {
    alignItems: "center",
    marginTop: 8,
  },
});

export default RecipeDetailsScreen;
