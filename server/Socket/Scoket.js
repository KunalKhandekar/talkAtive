const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const MessageModel = require("../Models/messageModel");
const ConversationModel = require("../Models/conversationModel");
const UserModel = require("../Models/userModel");
const { frontEND_URL } = require("../Utils/constants");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-talkative.vercel.app",
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

  socket.on("Seen_Unseen_MSG", async ({ receiverId, senderId }) => {
    try {
      await MessageModel.updateMany(
        { senderId: receiverId, receiverId: senderId, seen: { $ne: senderId } },
        { $push: { seen: senderId } }
      );
      UpdateConvo_Reuseable_Function(senderId, receiverId);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("Delete_Message", async (messageModel) => {
    const { senderId, receiverId, _id } = messageModel;
    await MessageModel.findByIdAndDelete(_id);
    UpdateConvo_Reuseable_Function(senderId, receiverId); 
  });

  socket.on("disconnect", async () => {
    console.log("User Disconnected: " + socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

const UpdateConvo_Reuseable_Function = async (senderId, receiverId) => {
  const updatedConversation = await ConversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
  })
    .populate("participants")
    .populate("messages");

  updatedConversation?.participants?.forEach(async (participant) => {
    const unreadMessageCount = await MessageModel.countDocuments({
      receiverId: participant._id,
      seen: { $ne: participant._id },
    });

    const socketId = getSocketId(participant._id.toString());
    if (socketId) {
      io.to(socketId).emit(
        "seenMessageUpdated",
        updatedConversation?.messages
      );
      io.to(socketId).emit("conversationUpdated", {
        updatedConversation,
        unreadMessageCount,
      });
    }
  });
}

module.exports = {
  server,
  getSocketId,
  userSocketMap,
  app,
  io,
};
