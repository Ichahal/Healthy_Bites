import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input, Button, Icon, CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { signin } from './firebase/auth';
import { CommonActions } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
          handleLogin(savedEmail, savedPassword);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async (emailParam = email, passwordParam = password) => {
    try {
      const { userCredential, userDetails } = await signin(emailParam, passwordParam);
      if (userCredential && userDetails) {
        if (rememberMe) {
          await AsyncStorage.setItem('email', emailParam);
          await AsyncStorage.setItem('password', passwordParam);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main', params: { user: userDetails } }],
          })
        );
      }
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case "auth/invalid-email":
          Alert.alert("Login Failed", "Invalid email format.");
          break;
        case "auth/user-not-found":
          Alert.alert("Login Failed", "No user found with this email.");
          break;
        case "auth/wrong-password":
          Alert.alert("Login Failed", "Incorrect password.");
          break;
        default:
          Alert.alert("Login Failed");
      }
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require("./assets/diet.png")} style={styles.image} />
      <Text style={styles.heading}>Healthy Bites</Text>
      <Input
        placeholder="Email"
        leftIcon={<Icon name="email" size={24} color="#FD5D69" />}
        onChangeText={(value) => setEmail(value)}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />
      <Input
        placeholder="Password"
        leftIcon={<Icon name="lock" size={24} color="#FD5D69" />}
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry={true}
      />
      <CheckBox
        title="Remember Me"
        checked={rememberMe}
        onPress={() => setRememberMe(!rememberMe)}
        containerStyle={styles.checkbox}
      />
      <Button
        title="Login"
        onPress={() => handleLogin()}
        buttonStyle={[styles.button]}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Forgot Password")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
    alignSelf: "center",
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
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#FD5D69",
  },
  link: {
    color: "#FD5D69",
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
});
