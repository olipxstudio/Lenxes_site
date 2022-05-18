const dotenv = require("dotenv");
dotenv.config({ path: "./config/_config.env" });

const express = require("express");
const cors = require("cors");
const {
  clientError,
  serverError,
  generateUniqueUserId,
} = require("./utils/common");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
} = require("./utils/middlewares");
const db = require("./config/db");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

// Omega just cloned and made hs first commit
// app.post("/create", validateUserEmail, checkIfUserAlreadyExist, (req, res) => {
//   const { email, password } = req.body;
//   const uniqueID = generateUniqueUserId();
//   try {
//     const newUser = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
//     db.query(newUser, (err, result) => {
//       if (err) {
//         clientError(res, err);
//       } else {
//         res.status(200).json({
//           success: true,
//           message: "User created",
//           data: result,
//         });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     serverError(res, error);
//   }
// });

// get all users
// @desc: get all users from users table || @route: GET /api/get/users  || @access:admin
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

const signUpRoute = require('./routes/users/signup')
const userActionRoute = require('./routes/users/actions')
app.use('/signup', signUpRoute)
app.use('/action', userActionRoute)

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
