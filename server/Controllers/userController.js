const ConversationModel = require("../Models/conversationModel");
const MessageModel = require("../Models/messageModel");
const UserModel = require("../Models/userModel");


const getUserForSidebar = async (req, res, next) => {
  try {
    const startedConversations = await ConversationModel.find({
      participants: { $in: [req.user.userId] },
    })
      .populate("participants")
      .populate("messages")
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(startedConversations.map(async (convo) => {
      const isFirstParticipant = convo.participants[0]._id.toString() == req.user.userId;
      const user = isFirstParticipant ? convo.participants[1] : convo.participants[0];

      // Calculate unread message count
      const unreadMessageCount = await MessageModel.countDocuments({
        receiverId: req.user.userId,
        senderId: user._id,
        seen: false
      });

      return {
        _id: convo._id,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePic: user.profilePic,
        },
        lastMessage: {
          message: convo.messages[convo.messages.length - 1].message,
        },
        lastMessageTime: convo.updatedAt,
        unreadMessageCount,
      };
    }));

    return res.status(200).json({ success: true, users: conversations });
  } catch (error) {
    next(error);
  }
};

const getUserForSearch = async (req, res, next) => {
  const { search } = req.body;
  
  try {
    const users = await UserModel.find({
      $and: [
        { _id: { $ne: req.user.userId } },
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserForSidebar,
  getUserForSearch,
};
