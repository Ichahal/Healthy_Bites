import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addUser } from "./firestore"; 
const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addUser({ email: user.email, uid: user.uid }, 'users'); 
    return userCredential;
  } catch (err) {
    console.error(err);
    throw err; 
  }
};

const signin = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and Password cannot be empty');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (err) {
    console.error(err);
    throw err; 
  }
};

const signout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    throw err; 
  }
};

export { signup, signin, signout };
