const User = require("../../models/users/User");
const Post = require("../../models/users/Post");
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
      followers: 0,
      following: 0,
      posts: 0,
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
    useValidationError(res, error);
  }
};

// login user and send token
// @desc: login user and send token || @route: POST /api/users/post/user/login  || @access:public
exports.loginUser = async (req, res) => {
  const { password } = req.body;
  const user_datas = req.user;

  try {
    const passwordIsCorrect = await User.comparePassword(
      password, // password from user
      user_datas.password // user password
    );

    if (!passwordIsCorrect) {
      return clientError(res, "Invalid password");
    }

    // create token to sign in user after login
    const token = createToken({ _id: user_datas._id });

    return res.status(200).json({
      success: true,
      token: token,
      message: "Login successful",
      data: {
        _id: user_datas._id,
        fullname: user_datas.fullname,
        email: user_datas.email,
        phone: user_datas.phone,
        profession: user_datas.profession,
        followers: user_datas.followers,
        following: user_datas.following,
        posts: user_datas.posts,
        status: user_datas.status,
      },
    });
  } catch (error) {
    return clientError(res, error);
  }
};

// forgot password request
// @desc: forgot password request || @route: POST /api/users/post/user/forgot-password  || @access:public
exports.forgotPassword = async (req, res) => {
  try {
    // create token to reset password
    const token = createToken({ _id: req.user._id });

    // send email to user
    // sendEmail(user.email, token);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return clientError(res, error);
  }
};

// Add new Post Media Photo
// @desc: Add new Post Photo || @route: POST /api/users/post/addPostPhoto  || @access:public
exports.AddNewPostPhoto = async (req, res) => {
    const {identifier, post_from} = req.body;
    const photo = req.imageUrl;
    const {_id} = req.user;
    try {
        const post = new Post({
            user: _id,
            post: photo,
            posted_from: post_from,
            post_type: 'photo',
            identifier: identifier,
            status: 'pending'
        });
        await post.save();
        res.status(200).json({
            success: true,
            message: "Photo Saved Successfully"
        })
    } catch (error) {
        return clientError(res, error);
    }
}
// Add new Post Media Video
// @desc: Add new Post Video || @route: POST /api/users/post/addPostVideo  || @access:public
exports.AddNewPostVideo = async (req, res) => {
    const {identifier, post_from} = req.body;
    const video = req.imageUrl;
    const {_id} = req.user;
    try {
        const post = new Post({
            user: _id,
            post: video,
            posted_from: post_from,
            post_type: 'video',
            identifier: identifier,
            status: 'pending'
        });
        await post.save();
        res.status(200).json({
            success: true,
            message: "Photo Saved Successfully"
        })
    } catch (error) {
        return clientError(res, error);
    }
}
// Add new Post
// @desc: Add new Post || @route: POST /api/users/post/addPost  || @access:public
exports.AddNewPost = async (req, res) => {
    const {identifier, post_from, tag_product, linking, caption, location, comment_permission, post_type} = req.body;
    const {_id} = req.user;
    try {
        const getPost = await Post.findOne(identifier);
        if(getPost.length > 0){
            return res.status(200).json({
                success: true,
                count: getPost.length,
                data: getPost
            })
        }else{
            return res.status(200).json({
                success: false,
                count: getPost.length
            })
        }
    } catch (error) {
        return clientError(res, error);
    }
}
