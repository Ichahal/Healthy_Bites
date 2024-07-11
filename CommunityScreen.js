import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const PRIMARY_COLOR = '#FD5D69';

const CommunityScreen = ({ user }) => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'Recipes'));
      const fetchedRecipes = [];
      for (const doc of querySnapshot.docs) {
        const recipeData = doc.data();
        // Fetch user profile details based on userId
        const userData = await fetchUserProfile(recipeData.userId);
        fetchedRecipes.push({
          id: doc.id,
          ...recipeData,
          user: userData
        });
      }
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.warn(`User with ID ${userId} not found`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const navigateToRecipeDetails = (recipeId, recipeName, recipeUser) => {
    navigation.navigate('Recipe Details Screen', {
      recipeId,
      recipeName,
      recipeUser,
      user, // Pass the user object to Recipe Details Screen
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeContainer} onPress={() => navigateToRecipeDetails(item.id, item.title, item.user)}>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.recipeImage} />
      ) : (
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.recipeImage} />
      )}
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDetails}>{item.description}</Text>
        <Text style={styles.recipeTime}>Time: {item.time}</Text>
        {item.user && (
          <View style={styles.profileContainer}>
            <Image source={{ uri: item.user.profilePictureUrl }} style={styles.userProfileImage} />
            <Text style={styles.userName}>{item.user.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Community Recipes</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={PRIMARY_COLOR}
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No recipes found.</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: PRIMARY_COLOR,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  recipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  recipeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  recipeTime: {
    fontSize: 12,
    color: '#333',
  },
  flatListContainer: {
    paddingVertical: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginRight: 10,
  },
  userProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default CommunityScreen;
