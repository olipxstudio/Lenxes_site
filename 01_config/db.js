// const mysql = require("mysql2");
const mongoose = require("mongoose");

// // connect dadabase
// const db = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USERS,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// });

const connectDB = async () => {
  mongoose.connect(process.env.DATABASE_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const con = mongoose.connection;

  con.on("open", () => {
    console.log("db is now connected");
  });
};

// // export connection
module.exports = connectDB;
