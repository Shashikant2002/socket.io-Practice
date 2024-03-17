import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connection Successfull !!. Id is ", socket.id);

  // socket.emit("welcome", "Welcome new Socket.io");
  socket.emit("userConnect", `Welcome ${socket.id}`);
  socket.broadcast.emit("welcome", `Welcome to ${socket.id}`);

  socket.on("message", (data) => {
    io.to(data.room).emit("messageReceived", data.message);
  });

  socket.on("messageBroad", (data) => {
    console.log(data);
    socket.broadcast.emit("messageBroadReceived", `${data}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Working Fine !!",
  });
});
app.get("/me", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Working Fine !!",
    data: {
      name: "Shashikant",
      roll: 123,
    },
  });
});

server.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});
