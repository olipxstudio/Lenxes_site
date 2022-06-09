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

// upload user profile picture from req.imageUrl
// @desc: upload user profile picture || @route: PATCH /api/users/patch/uploadProfilePicture  || @access:public
exports.uploadUserProfilePicture = async (req, res) => {
  const { _id } = req.user;
  const { imageUrl } = req;
  try {
    const user = await User.findById(_id);
    user.photo = imageUrl;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    serverError(res, error);
    console.log(error);
  }
};

// update user bio, category, and website
// @desc: update user bio, category, and website || @route: PATCH /api/users/patch/uploadProfilePicture  || @access:public
exports.updateUserProfile = async (req, res) => {
  const { _id } = req.user;
  const { bio, category, website } = req.body;
  try {
    const user = await User.findById(_id);
    user.bio = bio;
    user.category = category;
    user.website = website;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// update user password
// @desc: update user password || @route: PATCH /api/users/patch/updatePassword  || @access:public
exports.updateUserPassword = async (req, res) => {
  const { _id } = req.user;
  const { newPassword } = req.body;
  try {
    const user = await User.findById(_id);
    user.password = await User.encryptPassword(newPassword);
    await user.save();

    res.status(200).json({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    serverError(res, error);
  }
};
