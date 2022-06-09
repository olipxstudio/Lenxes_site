const User = require("../../models/users/User");
const Post = require("../../models/users/Post");
const Like = require("../../models/users/Like");
const Notification = require("../../models/users/Notification");
const Saved = require("../../models/users/Saved");
const Niche = require("../../models/users/Niche");
const Nichemember = require("../../models/users/Nichemember");
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

// send video properties to user
// @desc: send video properties to user || @route: POST /api/users/post/uploadVideo  || @access:public
exports.sendVideo = async (req, res) => {
  const video = req.videoUrl;
  const thumbnail = req.thumb_url;
  return res.status(200).json({
    success: true,
    data: {
      video,
      thumbnail,
    },
  });
};

// send photo
// @desc: send photo to user || @route: POST /api/users/post/uploadPhoto  || @access:public
exports.sendPhoto = async (req, res) => {
  const photo = req.imageUrl;

  return res.status(200).json({
    success: true,
    data: {
      photo,
    },
  });
};

// create new post
// @desc: create new post || @route: POST /api/users/post/createPost  || @access:public
exports.createPost = async (req, res) => {
  const {
    media,
    thumbnail,
    tags,
    post_from,
    caption,
    location,
    permission,
    post_type,
  } = req.body;

  const { _id } = req.user;
  try {
    const post = new Post({
      user: _id,
      // post: media,
      post_meta: {
        image: post_type === "photo" ? media : null,
        video: post_type === "video" ? media : null,
        thumbnail: post_type === "video" ? thumbnail : null,
        text: post_type === "text" ? media : null,
      },
      // tag product
      tag_product: tags,
      post_from: post_from,
      caption: caption,
      location: location,
      comment_permission: permission,
      post_type: post_type,
      status: "Published",
    });
    await post.save();
    // inrement post count
    await User.findByIdAndUpdate(
      { _id },
      { $inc: { posts: 1 } },
      { new: true }
    );

    // get post count from User
    const user = await User.findById({ _id });

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: post,
      count: user.posts,
    });
  } catch (error) {
    return clientError(res, error);
  }
};

// save new like
// @desc: save new like || @route: POST /api/users/post/like  || @access:public
exports.RegisterLikes = async (req, res, next) => {
    const {_id} = req.user;
    const {post_id, post_type} = req.body;
    try {
        const postData = await Post.findById({_id:post_id})
        const send_to = postData.user
        const check = await Like.find(
            {
                $and:[
                    {post_id},
                    {post_type},
                    {post_owner_id: send_to},
                    {liker_id: _id}
                ]
            },
            "_id"
        )
        if (check.length>0) {
            // If like is found - meaning user already liked this post
            const result = await Like.deleteOne({check})
            await Post.findByIdAndUpdate(
                {_id: post_id},
                {$inc: {like_count: -1}}
            )
            res.status(200).json({
                success: true,
                message:"Post unliked successfully",
                data: result,
            })
        } else {
            // If not liked before
            const result = new Like({
                post_id,
                post_type,
                post_owner_id: send_to,
                liker_id: _id
            })
            await result.save()
            await Post.findByIdAndUpdate(
                {_id: post_id},
                {$inc: {like_count: 1}}
            )
            res.status(200).json({
                success: true,
                message:"Post liked successfully",
                data: result,
            })
            req.receiver = send_to
            req.purpose = 'liked'
            req.init_on = 'post'
            req.identity = post_id
            next()
        }
    } catch (error) {
        return clientError(res, error);
    }
}

// save new notification
// @desc: save new notification || @route: POST /api/users/post/notification  || @access:app
exports.Notifications = async (req, res) => {
    const {_id} = req.user;
    const receiver = req.receiver;
    const purpose = req.purpose;
    const init_on = req.init_on;
    const identity = req.identity;
    try {
        const result = new Notification({
            identity: init_on === 'post' ? { post_id: identity } : { account_id: identity },
            sender: _id,
            receiver,
            purpose,
            init_on
        })
        await result.save()
    } catch (error) {
        return clientError(res, error);
    }
}


// save post to user saved
// @desc: save post to user saved || @route: POST /api/users/post/saved  || @access:public
exports.Saved = async (req, res) => {
    const {_id} = req.user;
    const {post_id} = req.body;
    try {
        const postData = await Post.findById({_id:post_id})
        const ownerId = postData.user
        const check = await Saved.find(
            {
                $and:[
                    {post_id},
                    {post_owner_id: ownerId},
                    {user: _id}
                ]
            },
            "_id"
        )
        if (check.length>0) {
            // If saved is found - meaning user already saved this post
            const result = await Saved.deleteOne({check})
            res.status(200).json({
                success: true,
                message:"Post unsaved successfully",
                data: result,
            })
        } else {
            // If not saved before
            const result = new Saved({
                post_id,
                user: _id,
                post_owner_id: ownerId
            })
            await result.save()
            res.status(200).json({
                success: true,
                message:"Post saved successfully",
                data: result,
            })
        }
    } catch (error) {
        return clientError(res, error);
    }
}


// create new niche
// @desc: create new niche || @route: POST /api/users/post/createNiche  || @access:public
exports.NewNiche = async (req, res) => {
    const {_id} = req.user
    const {title, description, private, question} = req.body
    try {
        const result = new Niche({
            title,
            description,
            private,
            question,
            creator: _id
        })
        await result.save()
        res.status(200).json({
            success: true,
            message: "Niche created successfully",
            data: result
        })
    } catch (error) {
        clientError(res, error)
    }
}


// add member to niche
// @desc: add member to niche || @route: POST /api/users/post/addNicheMember  || @access:public
exports.AddMembertoNiche = async (req, res, next) => {
    const {_id} = req.user
    const {member_id, niche_id} = req.body
    try {
        const check = await Nichemember.find(
            {
                $and:[
                    {member: member_id},
                    {niche: niche_id}
                ]
            },
            "_id"
        )
        if (check.length>0) {
            // If member is found
            const result = await Nichemember.deleteOne({check})
            res.status(200).json({
                success: true,
                message:"Member removed successfully",
                data: result,
            })
        } else {
            // If niche is pending
            await Niche.findOneAndUpdate(
                {
                    $and:[
                        {_id: niche_id},
                        {status: 'pending'}
                    ]
                },
                {$set:{status: 'active'}, $inc:{members_count: 1}}
            )
            // If not member before
            const result = new Nichemember({
                niche: niche_id,
                member: member_id,
                niche_owner: _id
            })
            await result.save()
            res.status(200).json({
                success: true,
                message:"Member added successfully",
                data: result,
            })
            req.receiver = member_id
            req.purpose = 'membertoniche'
            req.init_on = 'account'
            req.identity = member_id
            next()
        }
    } catch (error) {
        clientError(res, error)
    }
}