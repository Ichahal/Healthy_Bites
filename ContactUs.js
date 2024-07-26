import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ensure this is the correct path to your Firebase configuration

const ContactUs = ({ navigation }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitContactUs = async () => {
    if (name && subject && contactNumber && email && message) {
      try {
        await addDoc(collection(db, "contactus"), {
          name,
          subject,
          contactNumber,
          email,
          message,
          createdAt: new Date(), // Optional: To track when the contact was created
        });
        Alert.alert("Success", "Your message has been sent!");
        // Clear the form fields
        setName("");
        setSubject("");
        setContactNumber("");
        setEmail("");
        setMessage("");
      } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Subject"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Message (Remaining 1,000 characters)
            </Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitContactUs}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
  scrollContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff9f8",
    fontSize: 16,
  },
  messageInput: {
    height: 250,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    backgroundColor: "#fff9f8",
  },
  submitButton: {
    backgroundColor: "#ff6347", // Button color
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 3, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ContactUs;
