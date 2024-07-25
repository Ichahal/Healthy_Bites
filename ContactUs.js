import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ensure this is the correct path to your Firebase configuration

const ContactUs = ({ navigation }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitContactUs = async () => {
    if (name && contactNumber && email && message) {
      try {
        await addDoc(collection(db, "contactus"), {
          name,
          contactNumber,
          email,
          message,
          createdAt: new Date() // Optional: To track when the contact was created
        });
        Alert.alert("Success", "Your message has been sent!");
        // Clear the form fields
        setName('');
        setContactNumber('');
        setEmail('');
        setMessage('');
      } catch (error) {
        console.error("Error adding document: ", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label2}>Message</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitContactUs}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <Button title="Go Back" onPress={() => navigation.goBack()} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white"
  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf:"center"
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  messageInput: {
    height: 200,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6F61', // Change to your preferred color
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactUs;
