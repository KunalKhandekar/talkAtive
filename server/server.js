const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { server, app } = require("./Socket/Scoket.js");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://chat-talkative.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./Routes/authRoutes.js"));
app.use("/api/chat", require("./Routes/chatRoutes.js"));
app.use("/api/user", require("./Routes/userRoutes.js"));

app.get("/api/hello", (req, res) => {
  return res.json({
    success: true,
    message: "Server is Running",
  })
});

// Middle Ware for Error Handler.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMsg = err.message || "Internal Server Error !!";
  return res.status(statusCode).json({
    success: false,
    message: errorMsg,
  });
});

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, () => {
      console.log("Server is Running at Port", PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed", error);
  });
