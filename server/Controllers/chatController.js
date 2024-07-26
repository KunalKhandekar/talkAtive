const ConversationModel = require("../Models/conversationModel");
const MessageModel = require("../Models/messageModel");
const { io, getSocketId } = require("../Socket/Scoket");

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    let Conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!Conversation) {
      Conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      Conversation.messages.push(newMessage._id);
    }

    await Conversation.save();

    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    };

    // Emitting conversationUpdated event
    const UpdatedConversation = await ConversationModel.findById(Conversation?._id).populate("participants")
    .populate("messages");

    UpdatedConversation.participants.forEach(participant => {
      const socketId = getSocketId(participant._id.toString());
      if (socketId) {
        io.to(socketId).emit('conversationUpdated', UpdatedConversation);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Message sent",
      Messages: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.userId;

    const Conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!Conversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation not found",
        Messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation found",
      Messages: Conversation?.messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
