import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
export const provider = new GoogleAuthProvider();
import { Request, Response } from "express";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createToken } from "../security/jwt-handling";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQkX9es68aUtthLmtTzK6T9TFToXu_GtE",
  authDomain: "mafia-ce294.firebaseapp.com",
  projectId: "mafia-ce294",
  storageBucket: "mafia-ce294.appspot.com",
  messagingSenderId: "159102484359",
  appId: "1:159102484359:web:38d8322bdbc77315441d22",
  measurementId: "G-X283NRB22E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const logInWithGoogle = async (req: Request, res: Response) => {
  try {
    let uId = req.body.uid
    const jwt = createToken(uId);
    res.send({jwt});
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const signUpWithGoogle = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        let uId = user.uid
        const jwt = createToken(uId);
        res.send({jwt});
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(400).send(errorMessage);
      });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const signInWithGoogle = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        let uId = user.uid
        const jwt = createToken(uId);
        res.send({jwt});
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(400).send(errorMessage);
      });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};
