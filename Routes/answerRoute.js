const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  postAnswer,
  getAnswersByQuestionId,
} = require("../controller/answerController");

// 1. Post answer - (POST /api/answers)
router.post("/", authMiddleware, postAnswer);

// 2. Get answers for a question - (GET /api/answers/:questionid)
router.get("/:questionid", authMiddleware, getAnswersByQuestionId);

module.exports = router;