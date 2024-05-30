import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("User Name");
  const [username, setUsername] = useState("username");
  const [presentation, setPresentation] = useState(
    "User description goes here. This is a placeholder for the user's bio or presentation."
  );
  const [link, setLink] = useState("");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }} // Placeholder image URL
        style={styles.profileImage}
      />
      <Text style={styles.editPhotoText}>Edit Photo</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Presentation"
        multiline
        numberOfLines={4}
        value={presentation}
        onChangeText={setPresentation}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Link"
        value={link}
        onChangeText={setLink}
      />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: "#ff6347",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#ff6347",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 16,
  },
  editPhotoText: {
    textAlign: "center",
    color: "#ff6347",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f7d8d8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#ff6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
