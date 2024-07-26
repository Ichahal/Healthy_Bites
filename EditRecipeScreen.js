import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db } from "../Healthy_Bites/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditRecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId } = route.params; // recipeId from the navigation params

  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [ingredients, setIngredients] = useState([{ amount: "", ingredient: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchRecipe();
    requestPermission(); // Request permission on component mount
  }, [recipeId]);

  // Function to fetch recipe data
  const fetchRecipe = async () => {
    try {
      const docRef = doc(db, "Recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const recipeData = docSnap.data();
        setRecipe(recipeData);
        setTitle(recipeData.title);
        setDescription(recipeData.description);
        setTime(recipeData.time);
        setIngredients(recipeData.ingredients || [{ amount: "", ingredient: "" }]);
        setInstructions(recipeData.instructions || [""]);
        setPhoto(recipeData.photo);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      Alert.alert("Error", "Failed to fetch recipe details.");
    }
  };

  // Function to handle image picking
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
        if (result.assets && result.assets.length > 0) {
          setPhoto(result.assets[0].uri);
        } else {
          console.error("No assets found in result");
        }
      } else {
        console.log("Image selection cancelled");
      }
    };
  

  // Function to handle saving the updated recipe
  const handleSave = async () => {
    if (!title || !description || !time || !photo) {
      Alert.alert("Error", "Please fill out all fields and add a photo.");
      return;
    }

    const updatedRecipe = {
      title,
      description,
      time,
      ingredients,
      instructions,
      photo,
    };

    try {
      const docRef = doc(db, "Recipes", recipeId);
      await updateDoc(docRef, updatedRecipe);
      Alert.alert("Success", "Recipe updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating recipe:", error);
      Alert.alert("Error", "Failed to update recipe. Please try again later.");
    }
  };

  // Function to add a new ingredient field
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { amount: "", ingredient: "" }]);
  };

  // Function to add a new instruction field
  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  // Function to request image picker permissions
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'This app needs permission to access your photo library.');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={handlePickImage}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Recipe title"
          placeholderTextColor="#ff6347"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Recipe description"
          placeholderTextColor="#ff6347"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (e.g., 1 hour, 30 min)"
          placeholderTextColor="#ff6347"
          value={time}
          onChangeText={setTime}
        />
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              placeholder="Amt"
              placeholderTextColor="#ff6347"
              value={ingredient.amount}
              onChangeText={(text) => {
                const newIngredients = [...ingredients];
                newIngredients[index].amount = text;
                setIngredients(newIngredients);
              }}
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder="Ingredient..."
              placeholderTextColor="#ff6347"
              value={ingredient.ingredient}
              onChangeText={(text) => {
                const newIngredients = [...ingredients];
                newIngredients[index].ingredient = text;
                setIngredients(newIngredients);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                const newIngredients = ingredients.filter(
                  (_, i) => i !== index
                );
                setIngredients(newIngredients);
              }}
            >
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddIngredient}
        >
          <Text style={styles.addButtonText}>+ Add Ingredient</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionContainer}>
            <TextInput
              style={styles.instructionInput}
              placeholder={`Instruction ${index + 1}`}
              placeholderTextColor="#ff6347"
              value={instruction}
              onChangeText={(text) => {
                const newInstructions = [...instructions];
                newInstructions[index] = text;
                setInstructions(newInstructions);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                const newInstructions = instructions.filter(
                  (_, i) => i !== index
                );
                setInstructions(newInstructions);
              }}
            >
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddInstruction}
        >
          <Text style={styles.addButtonText}>+ Add Instruction</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 0,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  photoContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7d8d8",
    marginBottom: 16,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 18,
    color: "#ff6347",
  },
  input: {
    height: 40,
    borderColor: "#ff6347",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: "#f7d8d8",
    color: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6347",
    marginVertical: 8,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  ingredientInput: {
    flex: 1,
    height: 40,
    borderColor: "#ff6347",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f7d8d8",
    color: "#333333",
    marginRight: 8,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  instructionInput: {
    flex: 1,
    height: 40,
    borderColor: "#ff6347",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f7d8d8",
    color: "#333333",
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#ff6347",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#ff6347",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    fontSize: 24,
    color: "#ff6347",
  },
});

export default EditRecipeScreen;
