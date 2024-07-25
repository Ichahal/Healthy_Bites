import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

const AboutScreen = ({ navigation }) => {
  const handleContactUsPress = () => {
    navigation.navigate("Contact Us"); // Ensure you have a ContactUs screen in your navigation stack
  };

  // Coordinates for 160 Kendal Ave, Toronto, ON M5R 1M3
  const coordinates = {
    latitude: 43.6695,
    longitude: -79.4056,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Image
        source={{ uri: "https://www.carstairsminorhockey.ca/wp-content/uploads/sites/1672/2019/04/about-us.jpg" }} // Replace with your actual image URL
        style={styles.image}
      />
      <Text style={styles.label}>Welcome to Healthy Bites!</Text>
      <Text style={styles.description}>
        Healthy Bites is a mobile recipe application designed to simplify the process of discovering, saving, and sharing nutritious recipes.
      </Text>
      <View style={styles.separator} />
      <Text style={styles.infoTitle}>Address</Text>
      <Text style={styles.infoText}>160 Kendal Ave, Toronto, ON M5R 1M3</Text>
      <Text style={styles.infoTitle}>Phone</Text>
      <Text style={styles.infoText}>+1 (437) 477-6201</Text>
      <Text style={styles.infoTitle}>Email</Text>
      <Text style={styles.infoText}>contact@healthybites.ca</Text>
      
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={coordinates} title="Healthy Bites" />
      </MapView> */}

      <TouchableOpacity style={styles.button} onPress={handleContactUsPress}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 16,
    resizeMode: "cover", // Changed to cover to ensure image covers the space properly
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#CCC",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  map: {
    width: "100%",
    height: 400,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FF6F61",
    padding: 16,
    borderRadius: 8,
    marginBottom:30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AboutScreen;
