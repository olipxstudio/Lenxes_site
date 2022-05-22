const db = require("../../01_config/db");
const User = require('../../models/users/User');
const { clientError, serverError } = require("../../02_utils/common");

// create new user
// @desc: get all users from users table || @route: GET /api/users/get/allUsers  || @access:admin
// exports.getAllUsers = async (req, res) => {
//   try {
//     const getUsers = "SELECT * FROM users_table";
//     db.query(getUsers, (err, result) => {
//       if (err) {
//         clientError(res, err);
//       } else {
//         res.status(200).json({
//           success: true,
//           cout: result?.length,
//           message: "Users fetched",
//           data: result,
//         });
//       }
//     });
//   } catch (error) {
//     serverError(res, error);
//   }
// };

// MONGODB
exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.find({});
        User.events.on('error', err => {
            return clientError(res,err);
        });
        res.status(200).json({
            success: true,
            message: "Users fetched",
            data: result,
        });
    } catch (error) {
        serverError(res, error);
    }
  };