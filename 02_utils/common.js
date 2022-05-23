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

const useValidationError = (res, error) =>{
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return clientError(res, messages);
  } else {
    return serverError(res, error);
  }
}

// generate unique user id
const generateUniqueUserId = () => {
  const userId = crypto.randomBytes(20).toString("hex");
  return userId;
};
const createToken = (user) => {
  const accessToken = jwt.sign(user, `${process.env.DEVELOPER_SECRETE}`, {
    // expiresIn: "24h",
    // it currently does not have an expiring date.
  });
  return accessToken;
};


//   export default serverError;
module.exports = {
  serverError,
  clientError,
  generateUniqueUserId,
  createToken,
  useValidationError
};
