const dbconnection = require("../db/db_config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  // 1. Validate required fields
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please Enter all required fields." });
  }

  // 2. Validate password length
  if (password.length < 6) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password must be at least 6 characters long." });
  }

  try {
    const [existingUser] = await dbconnection.execute(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email],
    );

    if (existingUser.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "this username or email already exists." });
    }

    // 4. Encrypt / Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Insert new user into database
    await dbconnection.execute(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword],
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}
 
async function login(req, res) {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields." });
  }

  try {
    // 2. Check if the user exists in the database
    const [user] = await dbconnection.execute(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials (user not found)." });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials (wrong password)." });
    }

    const username = user[0].username;
    const userid = user[0].userid;

    const token = jwt.sign(
      { username, userid },
      process.env.JWT_SECRET || "secret_key_here",
      { expiresIn: "1d" }
    );

    return res.status(StatusCodes.OK).json({
      msg: "User logged in successfully.",
      token,
      username,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred, please try again later." });
  }
}

async function check(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Valid user", username, userid });
}

module.exports = { register, login, check};
