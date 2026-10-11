const dbconnection = require("../db/db_config");
const { StatusCodes } = require("http-status-codes");

async function postQuestion(req, res) {
  const { title, description, tag } = req.body;
  const { userid } = req.user;  

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields (title and description)." });
  }

   const questionid = "Q_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

  try {
    await dbconnection.execute(
      "INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, userid, title, description, tag || null]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully.", questionid });
  } catch (error) {
    console.error("Post question error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}

async function getAllQuestions(req, res) {
  try {
     const [questions] = await dbconnection.execute(
      `SELECT q.questionid, q.title, q.description, u.username 
       FROM questions q 
       JOIN users u ON q.userid = u.userid 
       ORDER BY q.questionid DESC`
    );

    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("Get all questions error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}

async function getSingleQuestion(req, res) {
  const { questionid } = req.params;

  try {
    const [question] = await dbconnection.execute(
      `SELECT q.questionid, q.title, q.description, u.username 
       FROM questions q 
       JOIN users u ON q.userid = u.userid 
       WHERE q.questionid = ?`,
      [questionid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question was not found." });
    }

    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error("Get single question error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}

module.exports = { postQuestion, getAllQuestions, getSingleQuestion };