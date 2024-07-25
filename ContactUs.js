// ContactUs.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ContactUs = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      {/* Your Contact Us content goes here */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ContactUs;
