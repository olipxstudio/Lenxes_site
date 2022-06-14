const User = require("../../models/users/User");
const Site = require("../../models/professionals/Site");

const {
  generateUniqueUserId,
  clientError,
  serverError,
  useValidationError,
  createToken,
} = require("../../02_utils/common");




// create a site
// @desc: create a site || @route: POST /api/users/post/createSite  || @access:public
exports.createSite = async (req, res) => {
    const {_id} = req.user
    const {business_name, motto, location, address, phone, email, employee_size, access_pin, business_type} = req.body;
    try {
        const site = new Site({
            user: _id,
            business_name,
            motto,
            location,
            address,
            phone,
            email,
            employee_size,
            access_pin,
            business_type
        })
        await site.save()
        res.status(200).json({
            success: true,
            message:"Site created successfully",
            data: site,
        })
    } catch (error) {
        clientError(res, error)
    }
}
