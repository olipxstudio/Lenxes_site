// const mysql = require("mysql2");
const mongoose = require('mongoose')

// // connect dadabase
// const db = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USERS,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// });


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
    } catch (error) {
        console.log(error)
    }
}

// // export connection
module.exports = connectDB;