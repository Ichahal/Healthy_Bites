import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { signin } from './firebase/auth'; 

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { userCredential, userDetails } = await signin(email, password);
      if (userCredential) {
        Alert.alert('Login Successful', `Welcome ${userDetails.name}`);
        navigation.navigate('Home', { userDetails });
      }
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/invalid-email':
          Alert.alert('Login Failed', 'Invalid email format.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Login Failed', 'No user found with this email.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Login Failed', 'Incorrect password.');
          break;
        default:
          Alert.alert('Login Failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/diet.png')} style={styles.image} />
      <Text style={styles.heading}>Healthy Bites</Text>
      <Input
        placeholder='Email'
        leftIcon={<Icon name='email' size={24} color='black' />}
        onChangeText={value => setEmail(value)}
        value={email}
        autoCapitalize='none'
        keyboardType='email-address'
        containerStyle={styles.input}
      />
      <Input
        placeholder='Password'
        leftIcon={<Icon name='lock' size={24} color='black' />}
        onChangeText={value => setPassword(value)}
        value={password}
        secureTextEntry={true}
        containerStyle={styles.input}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        buttonStyle={[styles.button, { backgroundColor: 'green' }]}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  link: {
    color: 'darkgreen',
    marginTop: 20,
    textAlign: 'center',
  },
});