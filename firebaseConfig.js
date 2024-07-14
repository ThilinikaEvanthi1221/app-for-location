// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePerisistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgyCXHMuQvI-ilCOVQIyjUuR464qNqE4s",
  authDomain: "npk-data-tracker-655de.firebaseapp.com",
  projectId: "npk-data-tracker-655de",
  storageBucket: "npk-data-tracker-655de.appspot.com",
  messagingSenderId: "838481789154",
  appId: "1:838481789154:web:ca4022ef49730c28bb1ebb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };