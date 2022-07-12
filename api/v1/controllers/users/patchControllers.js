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
    user.status = "active";

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User security data updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
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
// @desc: update user bio, category, and website || @route: PATCH /api/users/patch/updateUserProfile  || @access:public
exports.updateUserProfile = async (req, res) => {
  const { _id } = req.user;
  const { fullname, bio, industry, website } = req.body; // industry is an ObjectID
  try {
    const user = await User.findById(_id);
    user.fullname = fullname =='' ? user.fullname : fullname;
    user.bio = bio;
    user.industry = industry;
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
// @desc: update user password || @route: PATCH /api/users/patch/updateUserPassword  || @access:public
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


// @desc: update two factor auth || @route: PATCH /api/users/patch/updateTwofactorAuth  || @access:public
exports.updateTwofactorAuth = async (req, res) => {
    const { _id } = req.user;
    const { enabled } = req.body;
    try {
        const result = await User.findOneAndUpdate(
            {_id},
            {$set:{two_factor_enabled: enabled}}
        )
        res.status(200).json({
            success: true,
            message: "Two factor auth updated successfully",
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: update user phone and email || @route: PATCH /api/users/patch/updateUserPhoneEmail  || @access:public
exports.updateUserPhoneEmail = async (req, res) => {
    const { _id } = req.user;
    const { phone, email } = req.body;
    try {
        const result = await User.findOneAndUpdate(
            {_id},
            {$set:{email, phone}}
        )
        res.status(200).json({
            success: true,
            message: "Phone, Email updated successfully",
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: manage account - add address || @route: PATCH /api/users/patch/updateAddAddress  || @access:public
exports.updateAddAddress = async (req, res) => {
    const { _id } = req.user;
    const { address } = req.body;
    // try {
    //     const result = await User.findOneAndUpdate(
    //         {_id},
    //         {$set:{email, phone}}
    //     )
    //     res.status(200).json({
    //         success: true,
    //         message: "Phone, Email updated successfully",
    //         result
    //     });
    // } catch (error) {
    //     serverError(res, error);
    // }
};


// @desc: manage account - update single address || @route: PATCH /api/users/patch/updateSingleAddress  || @access:public
exports.updateSingleAddress = async (req, res) => {
    const { _id } = req.user;
    const { index, address } = req.body;
    // try {
    //     const result = await User.findOneAndUpdate(
    //         {_id},
    //         {$set:{email, phone}}
    //     )
    //     res.status(200).json({
    //         success: true,
    //         message: "Phone, Email updated successfully",
    //         result
    //     });
    // } catch (error) {
    //     serverError(res, error);
    // }
};