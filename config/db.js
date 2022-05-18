const mysql = require("mysql2");

// connect dadabase
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERS,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// export connection
module.exports = db;
