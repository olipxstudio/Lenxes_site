require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const host_name = process.env.HOST;
const user_name = process.env.USER;
const password_name = process.env.PASSWORD;
const database_name = process.env.DATABASE;
const port = process.env.SERVER_PORT || 4000;

const db = mysql.createConnection({
  host: host_name,
  user: "root",
  password: password_name,
  database: database_name,
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Omega just cloned and made hs first commit
app.get("/omega", (req, res) => {
  res.status(200).send("Omega is here. One Love <3.");
});

// Making correction to the repo
app.get("/task", (req, res) => {
  res.status(200).send("Just a test API");
});

// Task three
app.get("/task3", (req, res) => {
  res.status(200).send("Just a test API");
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
