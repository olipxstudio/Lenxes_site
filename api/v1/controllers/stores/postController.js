const User = require("../../models/users/User");
const Store = require("../../models/stores/Store");

const {
  generateUniqueUserId,
  clientError,
  serverError,
  useValidationError,
  createToken,
} = require("../../02_utils/common");



// create a store
// @desc: create a store || @route: POST /api/users/post/createStore  || @access:public
exports.createStore = async (req, res) => {
    const {_id} = req.user
    const {shop_name, motto, location, address, phone, email, employee_size, access_pin, business_type, bank, account_number, account_name} = req.body;
    try {
        const store = new Store({
            user: _id,
            shop_name,
            motto,
            location,
            address,
            phone,
            email,
            employee_size,
            access_pin,
            business_type,
            bank,
            account_number,
            account_name
        })
        await store.save()
        res.status(200).json({
            success: true,
            message:"Store created successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}
