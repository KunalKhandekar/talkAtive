const express = require("express");
const { sendMessage, getMessages } = require("../Controllers/chatController");
const isAuthenticate = require("../MiddleWares/isAuthenticate");

const router = express.Router();

router.post("/send/:id", isAuthenticate, sendMessage);
router.get("/:id", isAuthenticate, getMessages);

module.exports = router;
