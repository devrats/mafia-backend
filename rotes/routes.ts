import express from 'express'
import { logInWithGoogle, signInWithGoogle, signUpWithGoogle } from '../controller/auth';
import { getUserGameHistory } from '../controller/curd/curd';
export const authRoutes = express.Router();

authRoutes.post('/login',logInWithGoogle);
authRoutes.post('/signup',signUpWithGoogle);
authRoutes.post('/signin',signInWithGoogle);
authRoutes.get('/usergamehistory', getUserGameHistory);