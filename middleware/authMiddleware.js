const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Authorization Header መኖሩን እና በ "Bearer " መጀመሩን ማረጋገጥ
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid (No token provided)." });
  }

  // 2. "Bearer " የሚለውን ቃል አስወግዶ ትክክለኛውን Token ብቻ መውሰድ
  const token = authHeader.split(" ")[1];

  try {
    // 3. Token ትክክለኛ መሆኑን በ JWT_SECRET ማረጋገጥ
    const { username, userid } = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key_here"
    );

    // 4. የተጠቃሚውን መረጃ ለቀጣዩ Controller እንዲደርስ በ req.user ውስጥ ማስቀመጥ
    req.user = { username, userid };

    // 5. ወደ ቀጣዩ ፋንክሽን/Controller እንዲያልፍ ማድረግ
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid (Token expired or wrong)." });
  }
}

module.exports = authMiddleware;