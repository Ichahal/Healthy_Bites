import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>About Us</Text>
          <Image source={require("./assets/diet.png")} style={styles.image} />
          <Text style={styles.label}>Welcome to Healthy Bites!</Text>
          <Text style={styles.description}>
            Healthy Bites is a mobile recipe application designed to simplify the
            process of discovering, saving, and sharing nutritious recipes.
          </Text>
          <View style={styles.separator} />
          <Text style={styles.infoTitle}>Address</Text>
          <Text style={styles.infoText}>160 Kendal Ave, Toronto, ON M5R 1M3</Text>
          <Text style={styles.infoTitle}>Phone</Text>
          <Text style={styles.infoText}>+1 (437) 477-6201</Text>
          <Text style={styles.infoTitle}>Email</Text>
          <Text style={styles.infoText}>contact@healthybites.ca</Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={coordinates} title="Healthy Bites" />
          </MapView>

          <TouchableOpacity style={styles.button} onPress={handleContactUsPress}>
            <Text style={styles.buttonText}>Contact Us</Text>
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
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    alignSelf: "center",
  },
  label: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: "center",
    color: "#ff6347",
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
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "start",
  },
  infoText: {
    fontSize: 16,
    textAlign: "start",
    marginVertical: 8,
    color: "#777",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
    marginBottom: 64,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AboutScreen;
