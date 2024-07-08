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
  apiKey: "AIzaSyDnRZ8GtO1JSnl-8OduPhvJoa3IdodjRM4",
  authDomain: "npkproject-6f6b2.firebaseapp.com",
  projectId: "npkproject-6f6b2",
  storageBucket: "npkproject-6f6b2.appspot.com",
  messagingSenderId: "602726911790",
  appId: "1:602726911790:web:0598d809bc26c3270e34bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };