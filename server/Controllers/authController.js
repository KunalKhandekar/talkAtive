const UserModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../Utils/ErrorHandler");
const { userSocketMap } = require("../Socket/Scoket");

const Register = async (req, res, next) => {
  const { firstName, lastName, email, password, profilePic } = req.body;

  if (!firstName || !lastName || !email || !password || !profilePic) {
    return next(errorHandler(400, "All fields are required"));
  }

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    return next(errorHandler(400, "User already exists"));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 16);

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic,
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10), // 10 Years
      })
      .status(201)
      .json({
        message: "Registration Successful",
        data: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
        success: true,
      });
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error"));
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(errorHandler(400, "Email or Password is incorrect"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(errorHandler(400, "Email or Password is incorrect"));
  }

  if (Object.keys(userSocketMap).includes(user?._id.toString())) {
    return next(
      errorHandler(400, "User is currently logged in from another device")
    );
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET
  );

  return res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10), // 10 Years
    })
    .status(200)
    .json({
      message: "Login Successful",
      data: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        profilePic: user?.profilePic,
      },
      success: true,
    });
};

const Logout = async (req, res) => {
  try {
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logout Successful", success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Logout Failed", success: false });
  }
};

module.exports = { Register, Login, Logout };
