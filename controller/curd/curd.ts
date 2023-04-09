import { getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../connection/connection";
import { collection, addDoc } from "firebase/firestore";

const db = getFirestore(app);

export const createUser = async (data: any) => {
  try {
    console.log("baar baar kyu ho ra h");
    console.log(data);
    const { uid, email, displayName } = data;
    let photo = Math.ceil(Math.random()*10);
    console.log(photo);
    const docRef = await addDoc(collection(db, "users"), {
      displayName: displayName,
      uid: uid,
      email: email,
      gamePlayed: 8,
      gameWin: 5,
      gameMafia: 4,
      gameVillager: 4,
      photo: photo,
      gameHistory: [
        {
          code: "123456",
          result: "Lose",
          role: "Mafia",
        },
        {
          code: "123451",
          result: "Lose",
          role: "Villager",
        },
        {
          code: "123455",
          result: "Win",
          role: "Mafia",
        },
        {
          code: "123453",
          result: "Lose",
          role: "Mafia",
        },
        {
          code: "123454",
          result: "Win",
          role: "Villager",
        },
        {
          code: "123450",
          result: "Win",
          role: "Villager",
        },
        {
          code: "123489",
          result: "Win",
          role: "Mafia",
        },
        {
          code: "123467",
          result: "Lose",
          role: "Villager",
        },
      ],
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
  return {displayName, photo};
};
