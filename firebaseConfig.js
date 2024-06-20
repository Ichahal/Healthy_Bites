import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, isSupported } from "firebase/analytics";

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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { auth, db, analytics, storage };
