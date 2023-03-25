import { getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../connection/connection";
import { collection, addDoc } from "firebase/firestore";

const db = getFirestore(app);

export const createUser = async (data: any) => {
  try {
    console.log("baar baar kyu ho ra h");
    console.log(data);
    const { uid, email, displayName, photoURL } = data;
    const docRef = await addDoc(collection(db, "users"), {
      name: displayName,
      uId: uid,
      email: email,
      photos: photoURL,
      gamePlayed: 8,
      gameWin: 5,
      gameMafia: 4,
      gameVillager: 4,
      photo : 10,
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

export const checkUser = async (uId: string) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let flag = false;
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data().uId)}`);
    if(doc.data().uId == uId){
        flag = true;
    }
  });
  return flag;
};
