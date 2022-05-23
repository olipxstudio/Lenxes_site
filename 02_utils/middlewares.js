const { serverError, clientError } = require("./common");
const User = require('../models/users/User')

// Check if user already exists
exports.checkIfUserAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(user){
    return clientError(res, "Email already exists");
  }
  next();
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
