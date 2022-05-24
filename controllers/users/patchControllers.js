const db = require("../../01_config/db");
const User = require("../../models/users/User");
const { clientError, serverError } = require("../../02_utils/common");

// create new user
// @desc: update user security data || @route: PATCH /api/users/patch/updateSecurity  || @access:public
exports.updateUserSecurity = async (req, res) => {
  const { password, username } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    user.password = await User.encryptPassword(password);
    user.username = username;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User security data updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    serverError(res, error);
  }
};
