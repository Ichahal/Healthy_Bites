import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendOTP = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    // For simplicity, we assume the OTP is sent successfully
    Alert.alert("OTP Sent", "An OTP has been sent to your email.");
    navigation.navigate('ResetPassword', { email, otp: '123456' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <Input
        placeholder="Email"
        leftIcon={<Icon name="email" size={24} color="#FD5D69" />}
        onChangeText={(value) => setEmail(value)}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />
      <Button
        title="Send OTP"
        onPress={handleSendOTP}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center", 
    paddingHorizontal: 30, 
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#FD5D69",
  },
});
