import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNink3bFA0eARZb0Jog3WwwavTLU9-wAo",
  authDomain: "swe-ewi.firebaseapp.com",
  projectId: "swe-ewi",
  storageBucket: "swe-ewi.firebasestorage.app",
  messagingSenderId: "1093993037743",
  appId: "1:1093993037743:web:fa0e0f63e9d6557b1d795a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence); 
