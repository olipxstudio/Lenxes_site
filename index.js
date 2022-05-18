require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const host_name = process.env.HOST;
const usersid = process.env.USERS;
const password_name = process.env.PASSWORD;
const database_name = process.env.DATABASE;
const port = process.env.SERVER_PORT || 4000;

const db = mysql.createConnection({
  host: host_name,
  user: usersid,
  password: password_name,
  database: database_name,
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Omega just cloned and made hs first commit
app.post("/create", (req, res) => {
  let {email, password} = req.body;
  let send = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
  db.query(send, (err, result) => {
      if(err){
        res.send(err);
      }else{
        res.send(result);
      }
  })
});

// Making correction to the repo
app.get("/task", (req, res) => {
  res.status(200).send("Just a test API");
});

// Task three
app.get("/task3", (req, res) => {
  res.status(200).send("Just a test API");
});

// Task four
app.get("/login", (req, res) => {
  res.status(200).send("A login API");
});

// Task five
app.get("/register", (req, res) => {
  res.status(200).send("A register API");
});

// Task six
app.get("/signup", (req, res) => {
  res.status(200).send("A signup API");
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
