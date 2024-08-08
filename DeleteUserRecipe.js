import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { db } from "../Healthy_Bites/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const DeleteUserRecipe = ({ route }) => {
  const { recipeId, userId } = route.params;
  const navigation = useNavigation();

  const handleDeleteRecipe = async () => {
    try {
      // Delete the recipe from the "Recipes" collection
      await deleteDoc(doc(db, "Recipes", recipeId));

      // Delete the recipe from the user's "ownRecipes" subcollection
      await deleteDoc(doc(db, `users/${userId}/ownRecipes`, recipeId));

      Alert.alert("Success", "Recipe deleted successfully.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      Alert.alert("Error", "Failed to delete recipe. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warningText}>
        Are you sure you want to delete this recipe? This action cannot be undone.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Delete Recipe"
          color="#ff0000"
          onPress={handleDeleteRecipe}
        />
        <Button title="Cancel" onPress={handleCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  warningText: {
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
  },
});

export default DeleteUserRecipe;
