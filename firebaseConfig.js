import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyD-cxbUwELsuVXRo-t2fT0iMCX0pTTNpGk",
  authDomain: "healthy-bites-aeed7.firebaseapp.com",
  projectId: "healthy-bites-aeed7",
  storageBucket: "healthy-bites-aeed7.appspot.com",
  messagingSenderId: "969038308013",
  appId: "1:969038308013:web:e850a2e5e171010366dc24",
  measurementId: "G-RTV8LPW9E3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const analytics = getAnalytics(app);

export { db, auth}
