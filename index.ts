import express from "express";
import { authRoutes } from "./rotes/routes";
import cors from 'cors'
import cookieParser from'cookie-parser';
import dotenv from 'dotenv'
const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', (socket:any) => {
    console.log('A user connected');
  
    socket.on('chat-message', (message:any) => {
      console.log('Received message:', message);
      io.emit('chat-message', message);
      // Handle the received message and broadcast it to other clients
      // using socket.emit(), io.emit(), or other appropriate methods.
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      // Handle the disconnection event as needed.
    });
  });
  

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


server.listen(3001, () => {
  console.log('WebSocket server is running on port 3001');
});
