import { db } from "../firebaseConfig";
import {
  collection, doc, setDoc, getDoc, deleteDoc, updateDoc, query, where, getDocs
} from "firebase/firestore";

// Function to add a new user and initialize their subcollections
const addUser = async (itemToInsert, col) => {
  try {
    const userRef = doc(db, col, itemToInsert.email.toLowerCase());
    await setDoc(userRef, {
      ...itemToInsert,
      following: [] // Initialize `following` field as an empty array
    });

    // Initialize subcollections
    // await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/favouriteRecipes`, "initDoc"), { initialized: true });
    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/ownRecipes`, "initDoc"), { initialized: true });

    // Add recipe to Recipes collection
    const recipeRef = await setDoc(doc(db, "Recipes", itemToInsert.recipeId), itemToInsert);
    console.log("Recipe added to Recipes collection:", recipeRef.id);

    // Add recipe to user's ownRecipes subcollection
    const userOwnRecipeRef = await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/ownRecipes`, itemToInsert.recipeId), itemToInsert);
    console.log("Recipe added to user's ownRecipes subcollection:", userOwnRecipeRef.id);

    return userRef;
  } catch (err) {
    console.error("Error adding user:", err);
  }
};

// Function to delete a document
const delDoc = async (col, docId) => {
  try {
    await deleteDoc(doc(db, col, docId));
    console.log(`Document with ID ${docId} deleted from ${col} collection.`);
  } catch (err) {
    console.error("Error deleting document:", err);
  }
};

// Function to update a document
const update = async (itemToUpdate, col, docId) => {
  try {
    const docRef = doc(db, col, docId);
    await updateDoc(docRef, itemToUpdate);
    console.log(`Document with ID ${docId} updated in ${col} collection.`);
  } catch (err) {
    console.error("Error updating document:", err);
  }
};

// Function to select a document
const select = async (docId, col) => {
  try {
    const docRef = doc(db, col, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    console.error("Error retrieving document:", err);
  }
};

// Function to update user details
const updateUser = async (itemToUpdate, col, docId) => {
  try {
    const docRef = doc(db, col, docId);
    await updateDoc(docRef, itemToUpdate);
    console.log("User updated successfully:", itemToUpdate);
  } catch (err) {
    console.error("Error updating user document:", err);
    throw err;
  }
};

// Function to select recipes for a specific user
const selectRecipesForUser = async (userEmail) => {
  try {
    const q = query(collection(db, "Recipes"), where("userId", "==", userEmail));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Function to update user password (use Firebase Authentication for real password management)
const updateUserPassword = async (email, newPassword) => {
  console.warn("Password management should be handled with Firebase Authentication, not Firestore.");
  const userRef = doc(db, "users", email.toLowerCase());
  try {
    await updateDoc(userRef, { password: newPassword });
    console.log("Password updated successfully in Firestore");
  } catch (error) {
    console.error("Error updating password in Firestore:", error);
    throw error;
  }
};

// Function to follow another user
const handleFollow = async (user, recipeUser, setIsFollowing) => {
  if (user && recipeUser) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : { following: [] };
      const updatedFollowing = [...userData.following, recipeUser.uid];

      await updateDoc(userRef, { following: updatedFollowing });
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
      Alert.alert('Error', 'Failed to follow user. Please try again later.');
    }
  }
};

// Function to unfollow another user
const handleUnfollow = async (user, recipeUser, setIsFollowing) => {
  if (user && recipeUser) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : { following: [] };
      const updatedFollowing = userData.following.filter(uid => uid !== recipeUser.uid);

      await updateDoc(userRef, { following: updatedFollowing });
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      Alert.alert('Error', 'Failed to unfollow user. Please try again later.');
    }
  }
};

export { addUser, delDoc, update, select, updateUser, selectRecipesForUser, updateUserPassword, handleFollow, handleUnfollow };
