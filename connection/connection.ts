import {
    getAuth,
    GoogleAuthProvider
  } from "firebase/auth";
  export const provider = new GoogleAuthProvider();
  
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { firebaseConfig } from "../config/firebase-config";
  export const app = initializeApp(firebaseConfig);
  
  export const auth = getAuth();
  const db = getFirestore(app);