const User = require('../../models/users/User');
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


// Get people suggested to follow base on your category and top follower
// @desc: get suggested followers || @route: GET /api/users/get/suggestedToFollow  || @access:admin
exports.getSuggestedFollowers = async (req, res) => {
    const { _id } = req.user;
    try {
        const data = await User.findById({_id});
        const result = await User.find({category:data.category});
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