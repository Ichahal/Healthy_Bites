import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// need to modify for app

const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.log(err);
  }
};

export { signup, signin, signout };
