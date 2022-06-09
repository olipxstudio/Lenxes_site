const User = require("../../models/users/User");
const { clientError, serverError } = require("../../02_utils/common");
const Post = require("../../models/users/Post");
const Niche = require("../../models/users/Niche");
const Nichemember = require("../../models/users/Nichemember");

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

// get 15 users that are not _id from users where user.proffesion = user.proffesion  with highest followers and pass result to req.followerSuggestions
// @desc: get 30 users from users where user.proffesion = user.proffesion with highest followers || @route: GET /api/users/get/suggestedToFollow  || @access:users
exports.getSuggestedToFollow = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  try {
    // filter with $and
    const result = await User.find(
      {
        $and: [
          { _id: { $ne: _id }, status: "Active" },
          { profession: user.profession },
        ],
      },
      {
        username: 1,
        fullname: 1,
        profession: 1,
        photo: 1,
        followers: 1,
      }
    )
      .sort({ followers: -1 })
      .limit(15);
    req.followerSuggestions = result;
    next();
  } catch (error) {
    serverError(res, error);
  }
};

// get 15 random users from users with higest followers and combine result with req.followerSuggestions
// @desc: get 15 random users from users with higest followers || @route: GET /api/users/get/suggestedToFollow  || @access:users
exports.getRandomUsers = async (req, res) => {
  const { _id } = req.user;
  try {
    // dont include current user and sort by highest followers  photo: 1 }

    const result = await User.find(
      {
        $and: [{ _id: { $ne: _id }, status: "Active" }],
      },
      // project only the fields that we need
      {
        username: 1,
        fullname: 1,
        profession: 1,
        photo: 1,
        followers: 1,
      }
    )
      .sort({ followers: -1 })
      .limit(15);
    // combine result with req.followerSuggestions
    const combinedResult = [...req.followerSuggestions, ...result];

    res.status(200).json({
      success: true,
      message: "",
      count: combinedResult.length,
      data: combinedResult,
    });
  } catch (error) {
    serverError(res, error);
    console.log(error);
  }
};

// Get user profile details
// @desc: get user profile details || @route: GET /api/users/get/userProfileDetails  || @access:users
exports.getProfileDetails = async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await User.findById(_id);
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

// get posts of user
// @desc: get posts of user || @route: GET /api/users/get/posts  || @access:users
exports.getPosts = async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await Post.find({ user: _id });
    res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    serverError(res, error);
  }
};


// get niches
// @desc: get niches || @route: GET /api/users/get/niches/:number  || @access:users
exports.getNiches = async (req, res) => {
    const { _id } = req.user;
    const number = req.params.number;
    try {
        const data = await Niche.find({$and:[{private:false},{status:'active'}]}).limit(10).skip(number).populate("creator","fullname username photo");
        // const good = array()
        // const map = data.map((item,ind)=>{
            
        // })
        return console.log(data)
        const members = await Nichemember.find(
            {
                $and:[
                    {niche: data._id},
                    {status: 'active'}
                ]
            }
        )
        res.status(200).json({
            success: true,
            members,
            // count: data.length,
        });
    } catch (error) {
        serverError(res, error);
    }
};



// get single niches
// @desc: get single niches || @route: GET /api/users/get/singleNiche  || @access:users
exports.getSingleNiches = async (req, res) => {
    const { _id } = req.user;
    const {niche_id} = req.body
    try {
        
    } catch (error) {
        serverError(res, error);
    }
};
