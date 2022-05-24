const db = require("../../01_config/db");
const User = require('../../models/users/User')
const {
  generateUniqueUserId,
  clientError,
  serverError,
  useValidationError,
  createToken,
} = require("../../02_utils/common");

// create new user
// @desc: create new user account || @route: POST /api/users/post/user/new  || @access:public
exports.createNewUser = async (req, res) => {
  // const {address} = req.body
  // const {address_line1, address_line2, category, country, country_code, lga, formatted, lat, lon, name, result_type, state, state_code} = address;
  


    try {
        const user = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            profession: req.body.profession,
            followers:0,
            following:0,
            posts:0,
            // we will get the location data from a location API
            // address:{
            //   name: name,
            //   address_line1: address_line1,
            //   address_line2: address_line2,
            //   category: category,
            //   country: country,
            //   country_code: country_code,
            //   lga: lga,
            //   formatted: formatted,
            //   lat: lat,
            //   lon: lon,
            //   address_type: result_type,
            //   state: state,
            //   state_code: state_code,
            // },
            status: "Active",
        });


        // create user
        const newUser = await user.save();

        const { _id, fullname, phone, email, status } = newUser;

        // create token to sign in user after registration
        const token = createToken({ _id });

        return res.status(200).json({
        success: true,
        token: token,
        message: "Account created sucessfully",
        data: {
            _id,
            phone,
            email,
            status,
            fullname,
        },
        });
    } catch (error) {
        // we check to see if the error type is "ValidationError", then map and retrieve the error message which we defined in our User Schema.
        useValidationError(res,error)
    }
};
