// userRoute.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
// Destructure the functions from your controller file
const { register, login, check } = require("../controller/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/check", authMiddleware, check); // MUST be router.get

module.exports = router;
