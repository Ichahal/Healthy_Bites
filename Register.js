import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { signup } from './firebase/auth'; 

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await signup(email, password);
      if (userCredential) {
        Alert.alert('Registration Successful', 'You can now log in with your new account');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
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
        title="Register"
        onPress={handleRegister}
        buttonStyle={styles.button}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
});
