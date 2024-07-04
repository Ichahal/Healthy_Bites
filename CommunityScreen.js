import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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
      const fetchedRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRecipeDetails = (recipeId, recipeName) => {
    if (user && user.email) {
      navigation.navigate('Recipe Details Screen', {
        recipeId,
        recipeName,
        user,
      });
    } else {
      console.warn('User is not authenticated.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeContainer} onPress={() => navigateToRecipeDetails(item.id, item.title)}>
      <Image source={{ uri: item.photo }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDetails}>{item.description}</Text>
        <Text style={styles.recipeTime}>Time: {item.time}</Text>
        {user && (
          <View style={styles.profileContainer}>
            <Image source={{ uri: user.profilePictureUrl }} style={styles.userProfileImage} />
            <Text style={styles.userName}>{user.name}</Text>
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
    marginRight: 10
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
});

export default CommunityScreen;
