const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const serverError = (res, error) => {
  return res.status(500).json({
    success: false,
    err: `${process.env.NODE_ENV === "development" ? error : "Server Error"}`,
    error,
  });
};

// client error message
const clientError = (res, err) => {
  return res.status(208).json({
    success: false,
    message: err,
  });
};

const useValidationError = (res, error) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return clientError(res, messages);
  } else {
    return serverError(res, error);
  }
};

const createToken = (user) => {
  const accessToken = jwt.sign(user, `${process.env.DEVELOPER_SECRETE}`, {
    // expiresIn: "24h",
    // it currently does not have an expiring date.
  });
  return accessToken;
};

// validate user token
const validateUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, `${process.env.DEVELOPER_SECRETE}`, (err, user) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

//   export default serverError;
module.exports = {
  serverError,
  clientError,
  createToken,
  useValidationError,
  validateUserToken,
};
