const mysql2 = require("mysql2");
const dbconnection = mysql2.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});
console.log(process.env.DB_PASSWORD)
// dbconnection.execute("SELECT 'test' AS result", (err, result) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(result);
//   }
// });
module.exports = dbconnection.promise();
