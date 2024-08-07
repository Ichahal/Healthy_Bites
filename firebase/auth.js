import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { addUser, select } from "./firestore"; 

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

    // console.log('User authenticated successfully:', user);

    const userDetails = await select(user.email.toLowerCase(), 'users');
    if (!userDetails) {
      throw new Error('User details not found in database');
    }

    // console.log('User details retrieved:', userDetails);
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

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export { signup, signin, signout, sendPasswordReset };
