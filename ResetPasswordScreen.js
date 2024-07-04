import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { updatePasswordInDatabase } from './firebase/auth'; // Ensure this path is correct

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, otp: expectedOtp } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (otp !== expectedOtp) {
      Alert.alert("Error", "Invalid OTP.");
      return;
    }

    try {
      await updatePasswordInDatabase(email, newPassword);
      Alert.alert("Success", "Password reset successfully.");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Failed to reset password. Please try again.");
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
      <Input
        placeholder="New Password"
        leftIcon={<Icon name="lock" size={24} color="#FD5D69" />}
        onChangeText={(value) => setNewPassword(value)}
        value={newPassword}
        secureTextEntry={true}
        containerStyle={styles.input}
      />
      <Button
        title="Reset Password"
        onPress={handleResetPassword}
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
