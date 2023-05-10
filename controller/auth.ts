import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
export const provider = new GoogleAuthProvider();
import { Request, Response } from "express";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createToken } from "../security/jwt-handling";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../config/firebase-config";
import { checkUser, createUser, getUser } from "./curd/curd";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const logInWithGoogle = async (req: Request, res: Response) => {
  try {
    const { uid, email, displayName} = req.body
    const jwt = createToken(uid);
    console.log("lol");
    // createUser(req.body);
    let flag = await checkUser(uid);
    if(!flag){
      createUser(req.body);
    }
    const {photo} = await getUser(uid);
    res.send({jwt, uid, email, displayName, photo});
  } catch (error: any) {
    console.log(error);
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const signUpWithGoogle = async (req: Request, res: Response) => {
  try {
    const { displayName, email, password } = req.body;
    console.log(req.body);
    console.log(displayName);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const { uid, email } = user
        const jwt = createToken(uid);
        let data = {
          uid : uid,
          email : email,
          displayName: displayName
        }
        createUser(data);
        const {photo} = await getUser(uid);
        res.send({jwt, uid, email, displayName, photo});
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(201).send(errorCode);
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
      .then(async (userCredential) => {
        const user = userCredential.user;
        let uid = user.uid
        const jwt = createToken(uid);
        const {displayName, photo} = await getUser(uid);
        res.send({jwt, uid, email, displayName, photo});
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(201).send(errorCode);
      });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

