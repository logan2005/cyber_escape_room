// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8JDcxZHGXB-UaRwEaV0lV_9xEj9zAfqg",
  authDomain: "rtsshop-598bf.firebaseapp.com",
  projectId: "rtsshop-598bf",
  storageBucket: "rtsshop-598bf.firebasestorage.app",
  messagingSenderId: "1097323147970",
  appId: "1:1097323147970:web:b530670119ce6dbfbe015b",
  measurementId: "G-XTVX6VNNLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
