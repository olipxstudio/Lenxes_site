require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const {
  clientError,
  serverError,
  generateUniqueUserId,
  verifyEmail,
} = require("./utils/common");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT || 4000;

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERS,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// check if email already exists
app.post("/api/v1/auth/signup", (req, res, next) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return serverError(res, err);
    }
    if (results.length === 0) {
      next();
    } else {
      return clientError(res, "Email already exists");
    }
  });
});

// Omega just cloned and made hs first commit
app.post("/create", (req, res) => {
  const { email, password } = req.body;
  const uniqueID = generateUniqueUserId();
  const valideEmai = verifyEmail(email);
  if (!valideEmai) {
    return clientError(res, "Invalid email");
  }
  try {
    const newUser = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
    db.query(newUser, (err, result) => {
      if (err) {
        clientError(res, err);
      } else {
        res.status(200).json({
          success: true,
          message: "User created",
          data: result,
        });
      }
    });
  } catch (error) {
    console.log(error);
    serverError(res, error);
  }
});

// get all users
// @desc: get all users from users tabel || @route: GET /api/get/users  || @access:admin
app.get("/users", (req, res) => {
  try {
    const getUsers = "SELECT * FROM users";
    db.query(getUsers, (err, result) => {
      if (err) {
        clientError(res, err);
      } else {
        res.status(200).json({
          success: true,
          cout: result?.length,
          message: "Users fetched",
          data: result,
        });
      }
    });
  } catch (error) {
    console.log(error);
    serverError(res, error);
  }
});

console.log(generateUniqueUserId());

const signUpRoute = require('./routes/users/signup')
const userActionRoute = require('./routes/users/actions')
app.use('/signup', signUpRoute)
app.use('/action', userActionRoute)

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
