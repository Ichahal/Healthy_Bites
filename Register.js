import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { signup } from './firebase/auth'; 
import { doc, setDoc } from "firebase/firestore";

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await signup(email, password, name, dob, mobile);
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
        placeholder='Name'
        leftIcon={<Icon name='user' size={24} color='black' />}
        onChangeText={value => setName(value)}
        value={name}
        containerStyle={styles.input}
      />
      <Input
        placeholder='Date of Birth'
        leftIcon={<Icon name='calendar' size={24} color='black' />}
        onChangeText={value => setDob(value)}
        value={dob}
        containerStyle={styles.input}
      />
      <Input
        placeholder='Mobile Number'
        leftIcon={<Icon name='phone' size={24} color='black' />}
        onChangeText={value => setMobile(value)}
        value={mobile}
        keyboardType='phone-pad'
        containerStyle={styles.input}
      />
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
