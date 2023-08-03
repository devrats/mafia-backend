import {
  arrayUnion,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../../connection/connection";
import { collection, addDoc } from "firebase/firestore";
import { Request, Response } from "express";

const db = getFirestore(app);

export const createUser = async (data: any) => {
  try {
    const { uid, email, displayName } = data;
    let photo = Math.ceil(Math.random() * 10);
    const docRef = await addDoc(collection(db, "users"), {
      displayName: displayName,
      uid: uid,
      email: email,
      photo: photo,
    });
    const docRef1 = await setDoc(
      doc(db, "userGameHistory", JSON.stringify(uid)),
      {
        uid: uid,
        gameHistory: [],
        gameMafia: 0,
        gamePlayed: 0,
        gameVillager: 0,
        gameWin: 0,
        gameLoose: 0,
      }
    );
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    // console.error("Error adding document: ", e);
  }
};

export const checkUser = async (uid: string) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let flag = false;
  querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
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
      // console.log(`${doc.id} => ${JSON.stringify(doc.data().displayName)}`);
      displayName = doc.data().displayName;
      photo = JSON.stringify(doc.data().photo);
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
        // console.log(`${doc.id} => ${JSON.stringify(doc.data().displayName)}`);
        data = doc.data();
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
    let allowPlayer = true;
    let gameID:any
    while (allowPlayer) {
      allowPlayer = false;
      gameID = Math.floor(100000 + Math.random() * 900000);
      const querySnapshot = await getDocs(collection(db, "game"));
      querySnapshot.forEach((doc) => {
        console.log("aaaaaaaaa", doc.data());
        if (doc.data().gameID == gameID) {
          allowPlayer = true;
        }
      });
    }
    const docRef = await setDoc(doc(db, "game", JSON.stringify(gameID)), {
      uid: uid,
      gameID: gameID,
      players: [],
      gameStart: 0,
      round: [],
      result: "",
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
    let players: any = [];
    let allowPlayer = true;
    const querySnapshot = await getDocs(collection(db, "game"));
    querySnapshot.forEach((doc) => {
      console.log("aaaaaaaaa", doc.data());
      if (doc.data().gameID == gameCode) {
        players = doc.data().players;
      }
    });
    players?.forEach((x: any) => {
      if (x == uid) {
        console.log("bbbbbbb", x, uid);

        allowPlayer = false;
      }
    });
    if (!allowPlayer) {
      res.status(201).send("already exist");
      return;
    }
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
    let { uid } = req.body;
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.data().uid == uid) {
        // console.log(`${doc.id} => ${JSON.stringify(doc.data().displayName)}`);
        displayName = doc.data().displayName;
        photo = JSON.stringify(doc.data().photo);
      }
    });
    res.send({ displayName, photo });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const startGame = async (req: Request, res: Response) => {
  try {
    let gameCode = req.query.gameCode as string;
    const ref = doc(db, "game", gameCode);
    await updateDoc(ref, {
      gameStart: 1,
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

export const gameStarted = async (req: Request, res: Response) => {
  try {
    let { players, gameCode } = req.body;
    const ref = doc(db, "game", gameCode);
    await updateDoc(ref, {
      players: players,
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

export const whoami = async (req: Request, res: Response) => {
  try {
    let { uid, gameCode } = req.body;
    let role = "";
    const querySnapshot = await getDocs(collection(db, "game"));
    querySnapshot.forEach((doc) => {
      if (doc.data().gameID == gameCode) {
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        doc.data().players.forEach((item: any) => {
          if (item.uid == uid) {
            role = item.role;
          }
        });
      }
    });
    res.send({ role });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const isMafia = async (req: Request, res: Response) => {
  try {
    let { uid, gameCode } = req.body;
    let role = false;
    const querySnapshot = await getDocs(collection(db, "game"));
    querySnapshot.forEach((doc) => {
      if (doc.data().gameID == gameCode) {
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        doc.data().players.forEach((item: any) => {
          if (item.uid == uid && item.role == "Mafia") {
            role = true;
          }
        });
      }
    });
    res.send({ role });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const syncPlayer = async (req: Request, res: Response) => {
  try {
    const { uid, gameCode, players } = req.body;
    const ref = doc(db, "game", gameCode);
    await updateDoc(ref, {
      players: players,
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

export const player = async (req: Request, res: Response) => {
  try {
    let { gameCode } = req.query;
    let players;
    const querySnapshot = await getDocs(collection(db, "game"));
    querySnapshot.forEach((doc) => {
      if (doc.data().gameID == gameCode) {
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        players = doc.data().players;
      }
    });
    res.send({ players });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const updateUserGameHistory = async (req: Request, res: Response) => {
  try {
    let { gameCode, uid, role } = req.body;
    let played = 0;
    let rolePlayed = 0;
    const querySnapshot = await getDocs(collection(db, "userGameHistory"));
    querySnapshot.forEach((doc) => {
      if (doc.data().uid == uid) {
        played = doc.data().gamePlayed;
        rolePlayed =
          role == "Mafia" ? doc.data().gameMafia : doc.data().gameVillager;
      }
    });
    let data = {
      gameCode: gameCode,
      role: role,
      result: "No result",
    };
    const ref = doc(db, "userGameHistory", JSON.stringify(uid));
    if (role == "Mafia") {
      await updateDoc(ref, {
        gameHistory: arrayUnion(data),
        gamePlayed: played + 1,
        gameMafia: rolePlayed + 1,
      });
    } else {
      await updateDoc(ref, {
        gameHistory: arrayUnion(data),
        gamePlayed: played + 1,
        gameVillager: rolePlayed + 1,
      });
    }
    const ref1 = doc(db, "game", gameCode);
    await updateDoc(ref1, {
      result: "No result",
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

export const updateResult = async (req: Request, res: Response) => {
  try {
    let { gameCode, uid, role, result } = req.body;
    let status = 0;
    let data: any = [];
    let gameStatus: boolean;
    let results;
    if (
      (role == "Mafia" && result == "Mafia Wins") ||
      (role != "Mafia" && result == "Villagers Wins")
    ) {
      gameStatus = true;
    } else {
      gameStatus = false;
    }
    const querySnapshot = await getDocs(collection(db, "userGameHistory"));
    querySnapshot.forEach((doc) => {
      if (doc.data().uid == uid) {
        console.log(doc.data);
        data = doc.data().gameHistory;
        status = gameStatus ? doc.data().gameWin : doc.data().gameLoose;
      }
    });
    data.map((x: any) => {
      if (x.gameCode == gameCode) {
        results = x.result;
        if (gameStatus) {
          x.result = "Win";
        } else {
          x.result = "Loose";
        }
      }
    });
    console.log(data);
    console.log(uid, gameCode, status, role, result);

    if (results == "No result") {
      const ref = doc(db, "userGameHistory", JSON.stringify(uid));
      if (role) {
        if (gameStatus) {
          console.log("mmmmmmmm");
          await updateDoc(ref, {
            gameHistory: data,
            gameWin: status + 1,
          });
        } else {
          console.log("nnnnnnnnnnnnnnnnnnnnn");
          await updateDoc(ref, {
            gameHistory: data,
            gameLoose: status + 1,
          });
        }
      }
      const ref1 = doc(db, "game", gameCode);
      await updateDoc(ref1, {
        result: result,
      });
    }
    res.send("Success");
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};

export const updateRound = async (req: Request, res: Response) => {
  try {
    const { uid, gameCode, round } = req.body;
    const ref = doc(db, "game", gameCode);
    await updateDoc(ref, {
      round: arrayUnion(round),
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

export const getGame = async (req: Request, res: Response) => {
  try {
    const { uid, gameCode } = req.body;
    let game;
    const querySnapshot = await getDocs(collection(db, "game"));
    querySnapshot.forEach((doc) => {
      if (doc.data().gameID == gameCode) {
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        game = doc.data();
      }
    });
    res.send({ game });
  } catch (error: any) {
    if (error.code == 11000) {
      res.status(409).send(error);
    } else {
      res.status(400).send(error);
    }
  }
};
