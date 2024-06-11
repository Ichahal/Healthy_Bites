import { db } from "../firebaseConfig";
import {
  collection, doc, setDoc, getDoc, deleteDoc, updateDoc, addDoc, getFirestore
} from "firebase/firestore";
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const add = async (itemToInsert, col) => {
  try {
    console.log(`start add item. ${JSON.stringify(itemToInsert)}`);
    const insertedDocument = await addDoc(collection(db, col), itemToInsert);
    return insertedDocument;
  } catch (err) {
    console.error(err);
  }
};

const addUser = async (itemToInsert, col) => {
  try {
    // Add user to the specified collection
    const userRef = doc(db, col, itemToInsert.email.toLowerCase());
    await setDoc(userRef, itemToInsert);

    // Initialize "favouriteRecipes" and "ownRecipes" subcollections for the user
    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/favouriteRecipes`, "initDoc"), { initialized: true });
    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/ownRecipes`, "initDoc"), { initialized: true });

    // Add recipe to the "Recipes" collection
    const recipeRef = await setDoc(doc(db, "Recipes"), itemToInsert);
    console.log("Recipe added to Recipes collection:", recipeRef.id);

    // Add recipe to the "ownRecipes" subcollection of the user
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
    console.log("start to update...");
    console.log(`col: ${col}, docId: ${docId}`);
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

export { addUser, add, delDoc, update, select, updateUser };
