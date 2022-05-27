const User = require("../../models/users/User");
const { clientError, serverError } = require("../../02_utils/common");

// get all users
// @desc: get all users from users || @route: GET /api/users/get/allUsers  || @access:admin
exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json({
      success: true,
      count: result?.length,
      message: "",
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get people suggested to follow base on your category and top follower // Base on Top followers not done yet
// @desc: get suggested followers || @route: GET /api/users/get/suggestedToFollow  || @access:users
exports.getSuggestedFollowers = async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await User.findById({ _id });
    const result = await User.find({ category: data.category });
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get user profile details
// @desc: get user profile details || @route: GET /api/users/get/userProfileDetails  || @access:users
exports.getProfileDetails = async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await User.findById({ _id });
    res.status(200).json({
      success: true,
      username: data.username,
      fullname: data.fullname,
      category: data.category,
      bio: data.bio,
      website: data.website,
      photo: data.photo,
      followers: data.followers,
      following: data.following,
      posts: data.posts,
    });
  } catch (error) {
    serverError(res, error);
  }
};
