import { getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../connection/connection";
import { collection, addDoc } from "firebase/firestore";
import { Request, Response } from "express";

const db = getFirestore(app);

export const createUser = async (data: any) => {
  try {
    console.log("baar baar kyu ho ra h");
    console.log(data);
    const { uid, email, displayName } = data;
    let photo = Math.ceil(Math.random() * 10);
    console.log(photo);
    const docRef = await addDoc(collection(db, "users"), {
      displayName: displayName,
      uid: uid,
      email: email,
      photo: photo,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const checkUser = async (uid: string) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let flag = false;
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    if (doc.data().uid == uid) {
      flag = true;
    }
  });
  return flag;
};

export const getUser = async (uid: string) => {
  let displayName;
  let photo;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.data().uid == uid) {
      console.log(`${doc.id} => ${JSON.stringify(doc.data().displayName)}`);
      displayName = doc.data().displayName;
      photo = JSON.stringify(doc.data().photo);
      console.log(displayName);
    }
  });
  return { displayName, photo };
};

export const getUserGameHistory = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    let data;
    const querySnapshot = await getDocs(collection(db, "userGameHistory"));
    querySnapshot.forEach((doc) => {
      if (doc.data().uid == uid) {
        console.log(`${doc.id} => ${JSON.stringify(doc.data().displayName)}`);
        data = doc.data();
        console.log(data);
      }
    });
    res.send({ data });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};
