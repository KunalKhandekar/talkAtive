const UserModel = require("../Models/userModel");
const { getConversationForSideBar } = require("../Utils/getUserForSideBar");


const getUserForSidebar = async (req, res, next) => {
  try {
    const conversations = await getConversationForSideBar(req?.user?.userId);
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
