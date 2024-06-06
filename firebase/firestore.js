import { db } from "../firebaseConfig";
import {
  collection, doc, setDoc, getDoc, deleteDoc, updateDoc, addDoc
} from "firebase/firestore";

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
    console.log(`start add item. ${JSON.stringify(itemToInsert)}`);
    const userRef = doc(db, col, itemToInsert.email.toLowerCase());
    await setDoc(userRef, itemToInsert);

    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/favouriteRecipes`, "initDoc"), { initialized: true });
    await setDoc(doc(db, `${col}/${itemToInsert.email.toLowerCase()}/ownRecipes`, "initDoc"), { initialized: true });

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

export { addUser, add, delDoc, update, select };
