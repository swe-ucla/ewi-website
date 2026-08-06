// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNink3bFA0eARZb0Jog3WwwavTLU9-wAo",
  authDomain: "swe-ewi.firebaseapp.com",
  projectId: "swe-ewi",
  storageBucket: "swe-ewi.firebasestorage.app",
  messagingSenderId: "1093993037743",
  appId: "1:1093993037743:web:fa0e0f63e9d6557b1d795a",
  measurementId: "G-13NKNEXVNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);