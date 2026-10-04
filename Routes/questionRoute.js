const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  postQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../controller/questionController");

// 1. Post a new question - (POST /api/questions)
router.post("/", authMiddleware, postQuestion);

// 2. Get all questions - (GET /api/questions)
router.get("/", authMiddleware, getAllQuestions);

// 3. Get single question - (GET /api/questions/:questionid)
router.get("/:questionid", authMiddleware, getSingleQuestion);

module.exports = router;