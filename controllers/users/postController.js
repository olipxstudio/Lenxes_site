const db = require("../../01_config/db");
const {
  generateUniqueUserId,
  clientError,
  serverError,
} = require("../../02_utils/common");

// create new user
// @desc: create new user account || @route: POST /api/users/post/create  || @access:public
exports.createNewUser = async (req, res) => {
  const { email, password } = req.body;
  const uniqueID = generateUniqueUserId();
  try {
    const sql = `INSERT INTO users_table (uniqueID, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [uniqueID, email, password], (err, result) => {
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
    serverError(res, error);
  }
};
