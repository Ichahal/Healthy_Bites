import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import EditProfileScreen from "./EditProfileScreen"; // Ensure this screen is imported
import { signout } from "./firebase/auth";
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const Profile = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }} // Placeholder image URL
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>User Name</Text>
          <Text style={styles.profileUsername}>@username</Text>
          <Text style={styles.profileDescription}>
            User description goes here. This is a placeholder for the user's bio
            or presentation.
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>recipes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>250</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
        <View style={styles.tabsContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Recipes</Text>
          <Text style={styles.tab}>Favorites</Text>
        </View>
        {/* Add the grid of recipes here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signout(); // Call the signout function
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Navigate to the Login screen
      });
    } catch (error) {
      console.error("Logout Error:", error);
      // Handle any logout errors here
    }
  };
  

  return (
    <MenuProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerRight: () => (
                <Menu>
                  <MenuTrigger>
                    <Text style={styles.menuText}>⋮</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={handleLogout} customStyles={optionStyles} text="Logout" />
                  </MenuOptions>
                </Menu>
              ),
              headerShown: true,
              headerTitle: '',
              headerLeft: () => null, 
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};


const optionStyles = {
  optionText: {
    fontSize: 16, // Adjust the font size as needed
  },
};



const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 40, // Adjust this value to move the content down
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6347",
  },
  profileUsername: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
  },
  tab: {
    fontSize: 16,
    color: "#666",
    padding: 8,
  },
  activeTab: {
    color: "#ff6347",
    borderBottomWidth: 2,
    borderBottomColor: "#ff6347",
  },
  menuButton: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 24,
    color: "#ff6347",
    marginRight: 16,
  },
});

export default ProfileScreen;
