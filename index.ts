import express from "express";
import { authRoutes } from "./rotes/routes";
import cors from 'cors'
import cookieParser from'cookie-parser';
import dotenv from 'dotenv'

const app = express();
dotenv.config();
app.use(cors({
    origin:'*',
    credentials:true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
app.use(cookieParser())
app.use(express.json())
app.use(authRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("connected to server succesfully", [PORT]);
}); 
