import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "../Healthy_Bites/firebase/firestore";
import { storage } from "../Healthy_Bites/firebaseConfig"; // Ensure firebaseConfig exports storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [description, setDescription] = useState(user.description);
  const [link, setLink] = useState(user.link || "");
  const [profileImage, setProfileImage] = useState(
    user.profilePictureUrl || ""
  );

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
      } else {
        console.error("No assets found in result");
      }
    } else {
      console.log("Image selection cancelled");
    }
  };

  const handleSave = async () => {
    let profilePictureUrl = profileImage;

    if (profileImage && profileImage.startsWith("file://")) {
      try {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `profileImages/${user.email.toLowerCase()}_profile_picture`
        );
        await uploadBytes(storageRef, blob);
        profilePictureUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Image upload error:", error);
        Alert.alert(
          "Error",
          "Failed to upload profile picture. Please try again later."
        );
        return;
      }
    }

    const updatedUser = {
      ...user,
      name,
      username,
      description,
      link,
      profilePictureUrl,
    };
    try {
      await updateUser(updatedUser, "users", user.email.toLowerCase());
      navigation.setOptions({ setUser: updatedUser }); // Update user state using navigation.setOptions
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert(
        "Error",
        "Failed to update profile. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={handlePickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
        )}
      </TouchableOpacity>
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
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Link"
        value={link}
        onChangeText={setLink}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
