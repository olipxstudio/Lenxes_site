const moment = require('moment')
const User = require("../../models/users/User");
const { clientError, serverError } = require("../../02_utils/common");
const Post = require("../../models/users/Post");
const Niche = require("../../models/users/Niche");
const Nichemember = require("../../models/users/Nichemember");
const Nichequestion = require("../../models/users/Nichequestion");
const Discuss = require("../../models/users/Discuss");
const DiscussChat = require("../../models/users/DiscussChat");
const Follow = require("../../models/users/Follow");
const Comments = require("../../models/users/Comments");
const Share = require("../../models/users/Share");
const Saved = require("../../models/users/Saved");
const Notification = require("../../models/users/Notification");
const { path } = require("@ffmpeg-installer/ffmpeg");

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
          { _id: { $ne: _id }, status: "active" },
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
        $and: [{ _id: { $ne: _id }, status: "active" }],
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
// @desc: get niches || @route: GET /api/users/get/niches/number - 10 per time || @access:users
exports.getNiches = async (req, res) => {
    const number = req.params.skip;
    try {
      const data = await Niche.find({
        $and: [{ private: false }, { status: "active" }],
      })
        .limit(10)
        .skip(number)
        .populate("creator", "fullname username photo");
  
      // for each niche get 5 members and place under each niche result
      const result = await Promise.all(
        data.map(async (niche) => {
          // find limit of 5 nichemembers where niche = niche._id and status = active
          const members = await Nichemember.find({
            $and: [{ niche: niche._id }, { status: "active" }],
          })
            .limit(5)
            .populate("member", "fullname username photo");
  
          // clean up the members array
          const membersList = members.map((member) => {
            return {
              userId: member.member._id,
              username: member.member.username,
              fullname: member.member.fullname,
              photo: member.member.photo,
            };
          });
          return { ...niche.toJSON(), members: membersList };
        })
      );
      res.status(200).json({
        success: true,
        data: result,
        count: result.length,
      });
    } catch (error) {
      serverError(res, error);
      console.log(error);
    }
};


// get single niches
// @desc: get single niches || @route: GET /api/users/get/singleNiche  || @access:users
exports.getSingleNiches = async (req, res) => {
    const { _id } = req.user;
    const {niche_id} = req.body
    try {
        const result = await Niche.findOne({_id: niche_id}).populate("creator","fullname username photo")
        const members = await Nichemember.find(
            {
                $and:[
                    {niche: result._id},
                    {status: 'active'}
                ]
            }
        ).limit(5)
        res.status(200).json({
            success: true,
            result,
            members
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get single niches members
// @desc: get single niches members || @route: GET /api/users/get/singleNicheMembers/number - 20 per time  || @access:users
exports.getSingleNichesMembers = async (req, res) => {
    const { _id } = req.user;
    const {niche_id} = req.body
    const number = req.params.number;
    try {
        const data = await Nichemember.find({$and:[{niche:niche_id},{status:'active'}]}).limit(20).skip(number).populate("member","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get single niches questions
// @desc: get single niches questions || @route: GET /api/users/get/singleNicheQuestions/number - 10 per time  || @access:users
exports.getSingleNichesQuestions = async (req, res) => {
    const { _id } = req.user;
    const {niche_id} = req.body
    const number = req.params.number;
    try {
        const data = await Nichequestion.find({$and:[{niche:niche_id},{status:'active'}]}).sort("-createdAt").limit(10).skip(number).populate("user","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};



// get discuss details
// @desc: gget discuss details || @route: GET /api/users/get/getDiscussDetails  || @access:users
exports.getDiscussDetails = async (req, res) => {
    const { _id } = req.user;
    const {discuss_id} = req.body
    try {
        const data = await Discuss.findOne({_id:discuss_id}).populate("people");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};



// get discuss chats
// @desc: gget discuss chats || @route: GET /api/users/get/getDiscussChats  || @access:users
exports.getDiscussChats = async (req, res) => {
    const { _id } = req.user;
    const {discuss_id} = req.body
    try {
        const data = await DiscussChat.find({discuss:discuss_id}).populate("user","fullname username photo").populate("attached");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};



// get all my followers
// @desc: gget all my followers || @route: GET /api/users/get/getFollowers/number  || @access:users
exports.getFollowers = async (req, res) => {
    const { _id } = req.user;
    const number = req.params;
    try {
        const data = await Follow.find({follow:_id}).limit(20).skip(number).populate("user","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get all my followings
// @desc: gget all my followings || @route: GET /api/users/get/getFollowings/number  || @access:users
exports.getFollowings = async (req, res) => {
    const { _id } = req.user;
    const number = req.params;
    try {
        const data = await Follow.find({user:_id}).limit(20).skip(number).populate("follow","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get single post details
// @desc: gget single post details || @route: GET /api/users/get/getSinglePost  || @access:users
exports.getSinglePost = async (req, res) => {
    const { _id } = req.user;
    const post_id = req.body;
    try {
        const data = await Post.findOne({post_id}).populate("user","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get single post comments
// @desc: get single post comments || @route: GET /api/users/get/getPostComments  || @access:users
exports.getPostComments = async (req, res) => {
    const { _id } = req.user;
    const {post_id} = req.body;
    try {
        const data = await Comments.find({post:post_id}).populate("user","fullname username photo").populate("replied_to","text photo tagged_product").populate("tagged_product");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};



// get single posts with linked word
// @desc: get single posts with linked word || @route: GET /api/users/get/getPostwithLinkedWord/number  || @access:users
exports.getPostwithLinkedWord = async (req, res) => {
    const { _id } = req.user;
    const {word} = req.body;
    const {number} = req.params;
    try {
        const data = await Post.find({linked_word:word}).limit(5).skip(number).populate("user","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get all items shared to me
// @desc: get all items shared to me || @route: GET /api/users/get/getShared/number - 10 per time  || @access:users
exports.getShared = async (req, res) => {
    const { _id } = req.user;
    const {number} = req.params;
    try {
        const data = await Share.find({_id}).limit(10).skip(number).sort("-date");
        const result = await Promise.all(
            data.map(async (item) => {
                const another = await Share.find({_id:item._id}).populate({path: 'item', model: item.item_type});
                return another;
            })
        );
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get all user saved post
// @desc: get all user saved post || @route: GET /api/users/get/getSaved/number - 10 per time  || @access:users
exports.getSaved = async (req, res) => {
    const { _id } = req.user;
    const {number} = req.params;
    try {
        const data = await Saved.find({_id}).limit(10).skip(number).sort("-date").populate("post_owner_id","fullname username photo").populate("post_id");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get all user notifications
// @desc: get all user notifications || @route: GET /api/users/get/getNotifications/number - 20 per time  || @access:users
exports.getNotifications = async (req, res) => {
    const { _id } = req.user;
    const {number} = req.params;
    try {
        const data = await Notification.find({receiver:_id}).limit(20).skip(number).sort("-init_date").populate("sender","fullname username photo");
        // populate identity
        const result = await Promise.all(
            data.map(async(item)=>{
                // update status to read
                await Notification.findByIdAndUpdate(
                    {_id:item._id},
                    {$set:{status:'read', read_date:Date.now()}}
                )
                const {post_id} = item.identity;
                if(post_id!=null){
                    return await Notification.findOne({_id:item._id}).populate({path:'identity.post_id',model: Post})
                }else{
                    return await Notification.findOne({_id:item._id}).populate({path:'identity.account_id',model: User})
                }
            })
        )
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// get explore posts
// @desc: get explore posts || @route: GET /api/users/get/getExplore/number - 20 per time  || @access:users
exports.getExplore = async (req, res) => {
    const { _id } = req.user;
    const {number} = req.params;
    try {
        const data = await Post.find({status:'Published'}).limit(20).skip(number).sort("-like_count -comment_count").populate("user","fullname username photo");
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        serverError(res, error);
    }
};



// get explore posts
// @desc: get explore posts || @route: GET /api/users/get/getMyDiscussions  || @access:users
exports.getMyDiscussions = async (req, res) => {
    const { _id } = req.user;
    try {
        const discuss = await Discuss.findOne({
            $and:[
                {creator:_id},
                {status:'active'}
            ]
        })
        const time = discuss.time_remaining;
        let hour = moment(time).format('Y-m-d hh:mm:ss')
        // const data = await Post.find({status:'Published'}).limit(20).skip(number).sort("-like_count -comment_count").populate("user","fullname username photo");
        res.status(200).json({
            success: true,
            data: hour
        });
    } catch (error) {
        serverError(res, error);
    }
};








