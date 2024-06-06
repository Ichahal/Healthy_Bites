import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const CreateRecipeScreen = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [ingredients, setIngredients] = useState([
    { amount: "", ingredient: "" },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const [photo, setPhoto] = useState(null);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { amount: "", ingredient: "" }]);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  const handlePublish = () => {
    if (!title || !description || !time || !photo) {
      Alert.alert("Error", "Please fill out all fields and add a photo.");
      return;
    }

    // Here you would handle publishing the recipe, e.g., saving to Firestore
    Alert.alert("Success", "Recipe published!");
  };

  return (
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
              const newIngredients = ingredients.filter((_, i) => i !== index);
              setIngredients(newIngredients);
            }}
          >
            <Text style={styles.deleteButton}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddInstruction}>
        <Text style={styles.addButtonText}>+ Add Instruction</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={() => Alert.alert("Delete", "Recipe deleted!")}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    marginTop: 16,
  },
  publishButton: {
    backgroundColor: "#ff6347",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  publishButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButtonContainer: {
    backgroundColor: "#ff6347",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    fontSize: 24,
    color: "#ff6347",
  },
});

export default CreateRecipeScreen;
