const dbconnection = require("../db/db_config");
const { StatusCodes } = require("http-status-codes");

// 1. Post a new answer (አዲስ መልስ መለጠፊያ)
async function postAnswer(req, res) {
  const { questionid, answer } = req.body;
  const { userid } = req.user; // ከ authMiddleware የተገኘ

  if (!questionid || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide both question ID and answer content." });
  }

  try {
    await dbconnection.execute(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionid, userid, answer]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully." });
  } catch (error) {
    console.error("Post answer error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}

// 2. Get answers for a specific question (የአንድን ጥያቄ መልሶች ማምጫ)
async function getAnswersByQuestionId(req, res) {
  const { questionid } = req.params;

  try {
    const [answers] = await dbconnection.execute(
      `SELECT a.answerid, a.answer, u.username 
       FROM answers a 
       JOIN users u ON a.userid = u.userid 
       WHERE a.questionid = ? 
       ORDER BY a.answerid DESC`,
      [questionid]
    );

    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Get answers error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}

// ሁለቱንም functions በትክክል Export ማድረግ
module.exports = { postAnswer, getAnswersByQuestionId };