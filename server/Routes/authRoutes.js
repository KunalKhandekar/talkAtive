const express = require("express");
const { Register, Login, Logout } = require("../Controllers/authController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

module.exports = router;
