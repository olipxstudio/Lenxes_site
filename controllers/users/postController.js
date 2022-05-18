const db = require("../../config/db");
const {
  generateUniqueUserId,
  clientError,
  serverError,
} = require("../../utils/common");

// create new user
// @desc: create new user account || @route: POST /api/users/post/create  || @access:public
exports.createNewUser = async (req, res) => {
  const { email, password } = req.body;
  const uniqueID = generateUniqueUserId();
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
    serverError(res, error);
  }
};
