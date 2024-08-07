const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

userSocketMap = {};

io.on("connection", async (socket) => {
  console.log("User Connected: " + socket.id);
  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ toUserId }) => {
    const participantSocketId = getSocketId(toUserId);
    if (participantSocketId) {
      io.to(participantSocketId).emit("typing", { fromUserId: userId });
    }
  });

  // toUserId means selectedConversation UserID;
  // fromUserId means Current/Sender UserID;
  
  socket.on("stopTyping", ({ toUserId }) => {
    const participantSocketId = getSocketId(toUserId);
    if (participantSocketId) {
      io.to(participantSocketId).emit("stopTyping", { fromUserId: userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected: " + socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

module.exports = {
  server,
  getSocketId,
  app,
  io,
};
