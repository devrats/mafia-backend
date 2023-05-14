import express from 'express'
import { logInWithGoogle, signInWithGoogle, signUpWithGoogle } from '../controller/auth';
import { createGame, feedback, gameStarted, getPlayerData, getUserGameHistory, joinGame, startGame, whoami } from '../controller/curd/curd';
export const authRoutes = express.Router();

authRoutes.post('/login',logInWithGoogle);
authRoutes.post('/signup',signUpWithGoogle);
authRoutes.post('/signin',signInWithGoogle);
authRoutes.get('/usergamehistory', getUserGameHistory);
authRoutes.post('/feedback', feedback);
authRoutes.get('/createGame', createGame);
authRoutes.post('/joingame', joinGame)
authRoutes.post('/getplayerdata', getPlayerData);
authRoutes.get('/startGame', startGame)
authRoutes.post('/gameStarted', gameStarted)
authRoutes.post('/whoami', whoami)