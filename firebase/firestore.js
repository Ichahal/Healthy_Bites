import { db } from "../firebaseConfig";
import {
  collection, doc, setDoc, getDoc, deleteDoc, updateDoc, addDoc, query, where, getDocs
} from "firebase/firestore";

const addUser = async (itemToInsert, col) => {
  try {
    const userRef = doc(db, col, itemToInsert.email.toLowerCase());
    await setDoc(userRef, itemToInsert);
    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/favouriteRecipes`, "initDoc"), { initialized: true });
    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/ownRecipes`, "initDoc"), { initialized: true });

    const recipeRef = await setDoc(doc(db, "Recipes"), itemToInsert);
    console.log("Recipe added to Recipes collection:", recipeRef.id);

    const userOwnRecipeRef = await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/ownRecipes`, recipeRef.id), itemToInsert);
    console.log("Recipe added to user's ownRecipes subcollection:", userOwnRecipeRef.id);

    return userRef;
  } catch (err) {
    console.error(err);
  }
};

const delDoc = async (col, docId) => {
  try {
    await deleteDoc(doc(db, col, docId));
  } catch (err) {
    console.error(err);
  }
};

const update = async (itemToUpdate, col, docId) => {
  try {
    const docRef = doc(db, col, docId);
    await updateDoc(docRef, itemToUpdate);
  } catch (err) {
    console.error(err);
  }
};

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
    console.error(err);
  }
};

const updateUser = async (itemToUpdate, col, docId) => {
  try {
    const docRef = doc(db, col, docId);
    await updateDoc(docRef, itemToUpdate);
    console.log("User updated successfully:", itemToUpdate);
  } catch (err) {
    console.error("Error updating document:", err);
    throw err;
  }
};

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

const updateUserPassword = async (email, newPassword) => {
  const userRef = doc(db, "users", email.toLowerCase());
  try {
    await updateDoc(userRef, { password: newPassword });
    console.log("Password updated successfully in Firestore");
  } catch (error) {
    console.error("Error updating password in Firestore:", error);
    throw error;
  }
};

export { addUser, delDoc, update, select, updateUser, selectRecipesForUser, updateUserPassword };
