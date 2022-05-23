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