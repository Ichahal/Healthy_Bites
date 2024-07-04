import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { sendPasswordReset } from './firebase/auth'; // Ensure this path is correct

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendPasswordReset = async () => {
    try {
      await sendPasswordReset(email);
      Alert.alert("Success", "Password reset email sent. Please check your inbox.");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert("Error", "Failed to send password reset email. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      <Input
        placeholder="OTP"
        leftIcon={<Icon name="vpn-key" size={24} color="#FD5D69" />}
        onChangeText={(value) => setOtp(value)}
        value={otp}
        keyboardType="numeric"
        containerStyle={styles.input}
      />
      <Button
        title="Send Password Reset Email"
        onPress={handleSendPasswordReset}
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
