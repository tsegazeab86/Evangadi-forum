require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/db_config");

const app = express();
const PORT = 5500;

// 2. ከዛ በኋላ Middlewares ይገባሉ
app.use(cors());
app.use(express.json());

// 3. Routes import ማድረግ
const userRoute = require("./Routes/UserRoute");
const questionRoute = require("./Routes/questionRoute");
const authMiddleware = require("./middleware/authMiddleware");
const answerRoute = require("./Routes/answerRoute");
// 3. Routes import ማድረግ
app.use("/api/answers", answerRoute);
app.use("/api/users", userRoute);
app.use("/api/questions", authMiddleware, questionRoute);

// Test Route
app.get("/", (req, res) => {
  res.send("Evangadi Forum API is running...");
});

// 5. Start Server and Test DB Connection
async function start() {
  try {
    // Test Database connection first
    const result = await dbconnection.execute("SELECT 'test' AS result");
    console.log("Database connection successful:", result[0]);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
}

start();
