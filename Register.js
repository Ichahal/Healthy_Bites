import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { signup } from './firebase/auth'; 
import { doc, setDoc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    hideDatePicker();

    setDob(selectedDate.toISOString().split('T')[0]);
  };

  const handleRegister = async () => {
    try {

      if (mobile.length !== 10) {
        Alert.alert('Registration Failed', 'Please enter a valid 10-digit mobile number');
        return;
      }
      
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
        placeholder="Name"
        leftIcon={<Icon name="badge" size={24} color="#FD5D69" />}
        onChangeText={(value) => setName(value)}
        value={name}
        containerStyle={styles.input}
      />
      <Input
        placeholder="Date of Birth"
        leftIcon={<Icon name="cake" size={24} color="#FD5D69" />}
        onFocus={showDatePicker}
        value={dob}
        containerStyle={styles.input}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <Input
        placeholder="Mobile Number"
        leftIcon={<Icon name="phone" size={24} color="#FD5D69" />}
        onChangeText={(value) => {
          if (/^\d+$/.test(value) && value.length <= 10) {
            setMobile(value);
          }
        }}
        value={mobile}
        keyboardType="phone-pad"
        containerStyle={styles.input}
      />
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
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#FD5D69",
  },
});
