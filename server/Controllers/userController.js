const ConversationModel = require("../Models/conversationModel");
const UserModel = require("../Models/userModel");

const getUserForSidebar = async (req, res, next) => {
  try {
    const startedConversation = await ConversationModel.find({
      participants: { $in: [req.user.userId] },
    })
      .populate("participants")
      .populate("messages")
      .sort({ updatedAt: -1 });

    const conversation = startedConversation.map((convo) => {
      const isFirstParticipant = convo.participants[0]._id === req.user.userId;
      const user = isFirstParticipant
        ? convo.participants[0]
        : convo.participants[1];

      return {
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
      };
    });

    return res.status(200).json({ success: true, users: conversation });
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
