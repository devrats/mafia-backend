import {
  arrayUnion,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

export const feedback = async (req: Request, res: Response) => {
  try {
    const { star, comments, uid, type } = req.body;
    const docRef = await addDoc(collection(db, "feedback"), {
      star: star,
      comments: comments,
      uid: uid,
      type: type,
    });
    res.send("Success");
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;
    let gameID = Math.floor(100000 + Math.random() * 900000);
    const docRef = await setDoc(doc(db, "game", JSON.stringify(gameID)), {
      uid: uid,
      gameID: gameID,
      players: [],
    });
    res.send({ gameID });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const joinGame = async (req: Request, res: Response) => {
  try {
    const { uid, gameCode } = req.body;
    const ref = doc(db, "game", gameCode);
    await updateDoc(ref, {
      players: arrayUnion(uid),
    });
    res.send("Success");
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const getPlayerData = async (req: Request, res: Response) => {
  try {
    let displayName;
    let photo;
    let {uid} = req.body;
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.data().uid == uid) {
        console.log(`${doc.id} => ${JSON.stringify(doc.data().displayName)}`);
        displayName = doc.data().displayName;
        photo = JSON.stringify(doc.data().photo);
        console.log(displayName);
      }
    });
    res.send({displayName, photo});
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};
