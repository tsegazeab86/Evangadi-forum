const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid (No token provided)." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { username, userid } = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key_here",
    );

    req.user = { username, userid };

    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid (Token expired or wrong)." });
  }
}

module.exports = authMiddleware;
