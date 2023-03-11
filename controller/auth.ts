import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
export const provider = new GoogleAuthProvider();
import { Request, Response } from "express";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  console.log("haabhavgubhuyvgtfvyubijk");
  // console.log(req);
  try{
    // const {name, email, uid, photo} = req.body
    console.log(req);
    res.send(req.body);
}catch(error:any){
    console.log(error)
    if(error.code==11000){
        res.status(409).send(error)
    } else{
        res.status(400).send(error)
    }
}
};
