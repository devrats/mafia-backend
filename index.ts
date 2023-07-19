const express = require("express");
const { authRoutes } = require("./rotes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(authRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("connected to server succesfully", [PORT]);
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  },
});
io.on("connection", (socket: any) => {
  socket.on("chat-message", (message: any) => {
    io.emit("chat-message", message);
    // Handle the received message and broadcast it to other clients
    // using socket.emit(), io.emit(), or other appropriate methods.
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Handle the disconnection event as needed.
  });
});
