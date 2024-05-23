import { db } from "../firebaseConfig"
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore"

// need to modify for app

const add = async (itemToInsert, col) => {
  try {
    console.log("start add item. ${JSON.stringify(itemToInsert)}")

    const insertedDocument = await addDoc(collection(db, col), itemToInsert)
    console.log("Document written with ID: ", insertedDocument.id)
    return insertedDocument
    // display success message
  } catch (err) {
    console.log(err)
  }
}

const addUser = async (itemToInsert, col) => {
  try {
    console.log("start add item. ${JSON.stringify(itemToInsert)}")
    const insertedDocument = await setDoc(
      doc(db, col, itemToInsert.email.toLowerCase()),
      itemToInsert
    )
    console.log("Document written with ID: ", insertedDocument.id)
    // display success message
  } catch (err) {
    console.log(err)
  }
}

const delDoc = async (studentToDelete) => {
  try {
    await deleteDoc(doc(db, "collection", "id"))
  } catch (err) {
    console.log(err)
  }
}

const update = async (itemToUpdate, col, docId) => {
  try {
    console.log("start to update...")
    console.log("col:${col},docId:${docId}")
    const docRef = doc(db, col, docId)

    await updateDoc(docRef, itemToUpdate)
  } catch (err) {
    console.error(err)
  }
}

const select = async (docId, col) => {
  try {
    const docRef = doc(db, col, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!")
    }
  } catch (err) {
    console.log(err)
  }
}

export { addUser, add, delDoc, update, select }
