const db = require("../01_config/db");
const { serverError, clientError } = require("./common");

// Check if user already exists
exports.checkIfUserAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return serverError(res, err);
    }

    if (results.length > 0) {
      return clientError(res, "Email already exists");
    }
    next();
  });
};

// validate user email
exports.validateUserEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailRegex.test(String(email).toLowerCase());
  if (!emailRegex) {
    return clientError(res, "Invalid email");
  }
  next();
};
