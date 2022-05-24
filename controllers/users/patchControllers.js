const db = require("../../01_config/db");
const User = require('../../models/users/User')
const {
  generateUniqueUserId,
  clientError,
  serverError,
} = require("../../02_utils/common");

// create new user
// @desc: create new user account || @route: POST /api/users/post/create  || @access:public
exports.createNewUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    //   const result = new User({
    //       fullname,
    //       email,
    //       phone,
    //       profession,
    //       country,
    //       state,
    //       city
    //   })
    //   await result.save()
    //   if(result){
    //         res.status(200).json({
    //             success: true,
    //             message: "User created",
    //             data: result,
    //         });
    //   }
  } catch (error) {
    serverError(res, error);
  }
};
