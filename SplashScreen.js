import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {splashVisible ? (
        <View style={styles.splashContainer}>
          <Image source={require('./assets/diet.png')} style={styles.logo} />
          <Text style={styles.companyName}>Healthy Bites</Text>
        </View>
      ) : (
        <StatusBar style="auto" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'lightgreen', 
    },
    splashContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 200, 
      height: 200, 
      marginBottom: 16,
    },
    companyName: {
      fontSize: 38, 
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
