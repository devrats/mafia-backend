import express from 'express'
import { logInWithGoogle } from '../controller/auth';
export const authRoutes = express.Router();

authRoutes.post('/login',logInWithGoogle)