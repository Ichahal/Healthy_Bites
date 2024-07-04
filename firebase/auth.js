import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addUser, select, updateUserPassword } from "./firestore"; 
import { updatePassword as updatePasswordAuth } from "firebase/auth";

const signup = async (email, password, name, dob, mobile) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addUser({ email: user.email, uid: user.uid, name, dob, mobile, password }, 'users');
    console.log('User signed up successfully:', user);
    return userCredential;
  } catch (err) {
    console.error('Signup error:', err);
    throw err; 
  }
};

const signin = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and Password cannot be empty');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User authenticated successfully:', user);

    const userDetails = await select(user.email.toLowerCase(), 'users');
    if (!userDetails) {
      throw new Error('User details not found in database');
    }

    console.log('User details retrieved:', userDetails);
    return { userCredential, userDetails };
  } catch (err) {
    console.error('Signin error:', err);
    throw err; 
  }
};

const signout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (err) {
    console.error('Signout error:', err);
    throw err; 
  }
};


const updatePasswordInDatabase = async (email, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }
    await updatePassword(user, newPassword);
    await updateUserPassword(email, newPassword);
    console.log("Password updated successfully in Firebase and Firestore");
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export { signup, signin, signout, updatePasswordInDatabase };
