const User = require("../../models/users/User");
const Post = require("../../models/users/Post");
const Like = require("../../models/users/Like");
const Notification = require("../../models/users/Notification");
const Saved = require("../../models/users/Saved");
const Niche = require("../../models/users/Niche");
const Nichemember = require("../../models/users/Nichemember");
const Nichefollow = require("../../models/users/Nichefollow");
const Nichequestion = require("../../models/users/Nichequestion");
const Discuss = require("../../models/users/Discuss");
const Discussmembers = require("../../models/users/Discussmembers");
const DiscussChat = require("../../models/users/DiscussChat");
const DiscussChatNotify = require("../../models/users/DiscussChatNotify");
const Follow = require("../../models/users/Follow");
const Comments = require("../../models/users/Comments");
const Share = require("../../models/users/Share");
const Store = require("../../models/stores/Store");
const Social = require("../../models/users/Social");

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
      status: "pending",
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
  const thumbnail = req.videoThumbnail;
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
  const { _id } = req.user;
  const { post_id, post_type } = req.body;
  try {
    const postData = await Post.findById({ _id: post_id });
    const send_to = postData.user;
    const check = await Like.find(
      {
        $and: [
          { post_id },
          { post_type },
          { post_owner_id: send_to },
          { liker_id: _id },
        ],
      },
      "_id"
    );
    if (check.length > 0) {
      // If like is found - meaning user already liked this post
      const result = await Like.deleteOne({ check });
      await Post.findByIdAndUpdate(
        { _id: post_id },
        { $inc: { like_count: -1 } }
      );
      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        data: result,
      });
    } else {
      // If not liked before
      const result = new Like({
        post_id,
        post_type,
        post_owner_id: send_to,
        liker_id: _id,
      });
      await result.save();
      await Post.findByIdAndUpdate(
        { _id: post_id },
        { $inc: { like_count: 1 } }
      );
      res.status(200).json({
        success: true,
        message: "Post liked successfully",
        data: result,
      });
      req.receiver = send_to;
      req.purpose = "liked";
      req.init_on = "post";
      req.identity = post_id;
      next();
    }
  } catch (error) {
    return clientError(res, error);
  }
};

// save new notification
// @desc: save new notification || @route: POST /api/users/post/notification  || @access:app
exports.Notifications = async (req, res) => {
  const { _id } = req.user;
  const receiver = req.receiver;
  const purpose = req.purpose;
  const init_on = req.init_on;
  const identity = req.identity;
  try {
    const result = new Notification({
      identity:
        init_on === "post" ? { post_id: identity } : { account_id: identity },
      sender: _id,
      receiver,
      purpose,
      init_on,
    });
    await result.save();
  } catch (error) {
    return clientError(res, error);
  }
};

// save post to user saved
// @desc: save post to user saved || @route: POST /api/users/post/saved  || @access:public
exports.Saved = async (req, res) => {
  const { _id } = req.user;
  const { post_id } = req.body;
  try {
    const postData = await Post.findById({ _id: post_id });
    const ownerId = postData.user;
    const check = await Saved.find(
      {
        $and: [{ post_id }, { post_owner_id: ownerId }, { user: _id }],
      },
      "_id"
    );
    if (check.length > 0) {
      // If saved is found - meaning user already saved this post
      const result = await Saved.deleteOne({ check });
      res.status(200).json({
        success: true,
        message: "Post unsaved successfully",
        data: result,
      });
    } else {
      // If not saved before
      const result = new Saved({
        post_id,
        user: _id,
        post_owner_id: ownerId,
      });
      await result.save();
      res.status(200).json({
        success: true,
        message: "Post saved successfully",
        data: result,
      });
    }
  } catch (error) {
    return clientError(res, error);
  }
};

// create new niche
// @desc: create new niche || @route: POST /api/users/post/createNiche  || @access:public
exports.NewNiche = async (req, res) => {
  const { _id } = req.user;
  const { title, description, private, question } = req.body;
  try {
    const result = new Niche({
      title,
      description,
      private,
      question,
      creator: _id,
    });
    await result.save();
    res.status(200).json({
      success: true,
      message: "Niche created successfully",
      data: result,
    });
  } catch (error) {
    clientError(res, error);
  }
};

// add member to niche
// @desc: add member to niche || @route: POST /api/users/post/addNicheMember  || @access:public
exports.AddMembertoNiche = async (req, res, next) => {
  const { _id } = req.user;
  const { member_id, niche_id } = req.body;
  try {
    const check = await Nichemember.find(
      {
        $and: [{ member: member_id }, { niche: niche_id }],
      },
      "_id"
    );
    if (check.length > 0) {
      // If member is found
      const result = await Nichemember.deleteOne({ check });
      await Niche.findOneAndUpdate(
        { _id: niche_id },
        { $inc: { members_count: -1 } }
      );
      res.status(200).json({
        success: true,
        message: "Member removed successfully",
        data: result,
      });
    } else {
      // If niche is pending
      await Niche.findOneAndUpdate(
        {
          $and: [{ _id: niche_id }, { status: "pending" }],
        },
        { $set: { status: "active" } }
      );
      await Niche.findOneAndUpdate(
        { _id: niche_id },
        { $inc: { members_count: 1 } }
      );
      // If not member before
      const result = new Nichemember({
        niche: niche_id,
        member: member_id,
        niche_owner: _id,
      });
      await result.save();
      res.status(200).json({
        success: true,
        message: "Member added successfully",
        data: result,
      });
      req.receiver = member_id;
      req.purpose = "membertoniche";
      req.init_on = "account";
      req.identity = member_id;
      next();
    }
  } catch (error) {
    clientError(res, error);
  }
};

// follow and unfollow niche
// @desc: follow and unfollow niche || @route: POST /api/users/post/followUnfollowNiche  || @access:public
exports.followUnfollowNiche = async (req, res) => {
  const { _id } = req.user;
  const { niche_id } = req.body;
  try {
    const check = await Nichefollow.find(
      {
        $and: [{ user: _id }, { follow: niche_id }],
      },
      "_id"
    );
    // return console.log(check)
    if (check.length > 0) {
      // If I already follow this Niche
      const result = await Nichefollow.deleteOne({ check });
      res.status(200).json({
        success: true,
        message: "Unfollowed Niche successfully",
        data: result,
      });
    } else {
      // If not following Niche before
      const result = new Nichefollow({
        user: _id,
        follow: niche_id,
      });
      await result.save();
      res.status(200).json({
        success: true,
        message: "Followed Niche successfully",
        data: result,
      });
    }
  } catch (error) {
    clientError(res, error);
  }
};

// ask niche question
// @desc: ask niche question || @route: POST /api/users/post/nicheQuestion  || @access:public
exports.nicheQuestion = async (req, res) => {
  const { _id } = req.user;
  const { niche_id, question, photo } = req.body;
  try {
    const result = new Nichequestion({
      question,
      photo,
      niche: niche_id,
      user: _id,
    });
    await result.save();
    res.status(200).json({
      success: true,
      message: "Question asked successfully",
      data: result,
    });
  } catch (error) {
    clientError(res, error);
  }
};

// like and unlike niche question
// @desc: like and unlike niche question || @route: POST /api/users/post/likeUnlikeNicheQuestion  || @access:public
exports.likeUnlikeNicheQuestion = async (req, res, next) => {
  const { _id } = req.user;
  const { question_id } = req.body;
  try {
    const question_data = await Nichequestion.findOne({ _id: question_id });
    const owner_id = question_data.user;
    const check = await Like.find(
      {
        $and: [{ liker_id: _id }, { post_id: question_id }],
      },
      "_id"
    );
    if (check.length > 0) {
      // If I already likes this Niche question
      const result = await Like.deleteOne({ check });
      await Nichequestion.findByIdAndUpdate(
        { _id: question_id },
        { $inc: { like_count: -1 } }
      );
      res.status(200).json({
        success: true,
        message: "Unliked Niche question",
        data: result,
      });
    } else {
      // If I have not liked this Niche question
      const result = new Like({
        post_id: question_id,
        post_type: "post",
        post_owner_id: owner_id,
        liker_id: _id,
      });
      await result.save();
      await Nichequestion.findByIdAndUpdate(
        { _id: question_id },
        { $inc: { like_count: 1 } }
      );
      res.status(200).json({
        success: true,
        message: "Liked Niche question successfully",
        data: result,
      });
      req.receiver = owner_id;
      req.purpose = "liked";
      req.init_on = "post";
      req.identity = question_id;
      next();
    }
  } catch (error) {
    clientError(res, error);
  }
};

// create Discuss
// @desc: create Discuss || @route: POST /api/users/post/createDiscuss  || @access:public
exports.createDiscuss = async (req, res, next) => {
  const { _id } = req.user;
  const { discuss_item, type, member_one } = req.body;
  try {
    const result = new Discuss({
      creator: _id,
      discuss_item,
      type,
      members_count: 1,
      status: "active",
    });
    await result.save();
    const members = new Discussmembers({
      discuss: result._id,
      user: member_one,
    });
    await members.save();
    res.status(200).json({
      success: true,
      message: "Discuss created successfully",
      data: result,
    });
    req.receiver = member_one;
    req.purpose = "discuss";
    req.init_on = "account";
    req.identity = member_one;
    next();
  } catch (error) {
    clientError(res, error);
  }
};

// add member to Discuss
// @desc: add member to Discuss || @route: POST /api/users/post/addDiscussMember  || @access:public
exports.addDiscussMember = async (req, res, next) => {
  const { _id } = req.user;
  const { discuss_id, member } = req.body;
  try {
    const members = new Discussmembers({
      discuss: discuss_id,
      user: member,
    });
    await members.save();
    await Discuss.findByIdAndUpdate(
      { _id: discuss_id },
      { $inc: { members_count: 1 } }
    );
    res.status(200).json({
      success: true,
      message: "Discuss member added successfully",
      data: members,
    });
    req.receiver = member;
    req.purpose = "discuss";
    req.init_on = "account";
    req.identity = member;
    next();
  } catch (error) {
    clientError(res, error);
  }
};

// remove member from Discuss
// @desc: remove member from Discuss || @route: POST /api/users/post/removeDiscussMember  || @access:public
exports.removeDiscussMember = async (req, res) => {
  const { _id } = req.user;
  const { discuss_id, member } = req.body;
  try {
    await Discussmembers.findOneAndDelete({ user: member });
    await Discuss.findByIdAndUpdate(
      { _id: discuss_id },
      { $inc: { members_count: -1 } }
    );
    res.status(200).json({
      success: true,
      message: "Discuss member removed successfully",
    });
  } catch (error) {
    clientError(res, error);
  }
};

// add to a Discuss chat
// @desc: add to a Discuss chat || @route: POST /api/users/post/addDicsussChat  || @access:public
exports.addDicsussChat = async (req, res, next) => {
  const { _id } = req.user;
  const {
    discuss_id,
    photo,
    audio,
    text,
    replied_to,
    attached_type,
    attached,
  } = req.body;
  try {
    const result = new DiscussChat({
      user: _id,
      discuss: discuss_id,
      photo,
      audio,
      text,
      replied_to,
      attached_type,
      attached:
        attached_type === "post" ? { post: attached } : { product: attached },
    });
    result.save();
    res.status(200).json({
      success: true,
      message: "Chat sent successfully",
      data: result,
    });
    req.discuss = discuss_id;
    next();
  } catch (error) {
    clientError(res, error);
  }
};

// send notification to all discuss members except the poster
exports.sendDiscussNotification = async (req, res) => {
  const discuss = req.discuss;
  try {
    const data = await Discussmembers.find({
      $and: [{ discuss: discuss }, { status: "active" }],
    });
    const result = await Promise.all(
      data.map(async (item) => {
        const get = await DiscussChatNotify.findOneAndUpdate(
          {
            $and: [{ discuss: discuss }, { receiver: item.user }],
          },
          { $inc: { count: 1 }, $set: { status: "unread" } }
        );
        if (get == null) {
          const putin = new DiscussChatNotify({
            discuss: discuss,
            count: 1,
            receiver: item.user,
          });
          await putin.save();
          return putin;
        } else {
          return get;
        }
      })
    );
  } catch (error) {
    clientError(res, error);
  }
};

// follow or unfollow an account
// @desc: follow or unfollow an account || @route: POST /api/users/post/followOrUnfollow  || @access:public
exports.followOrUnfollow = async (req, res, next) => {
  const { _id } = req.user;
  const { follow_id } = req.body;
  try {
    const check = await Follow.find(
      {
        $and: [{ user: _id }, { follow: follow_id }],
      },
      "_id"
    );
    // return console.log(check)
    if (check.length > 0) {
      // If I already follow account
      const result = await Follow.deleteOne({ check });
      await User.findByIdAndUpdate(
        { _id: follow_id },
        { $inc: { followers: -1 } }
      );
      await User.findByIdAndUpdate({ _id }, { $inc: { following: -1 } });
      res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
        data: result,
      });
    } else {
      // If not following before
      const result = new Follow({
        user: _id,
        follow: follow_id,
      });
      await result.save();
      await User.findByIdAndUpdate(
        { _id: follow_id },
        { $inc: { followers: 1 } }
      );
      await User.findByIdAndUpdate({ _id }, { $inc: { following: 1 } });
      res.status(200).json({
        success: true,
        message: "Followed successfully",
        data: result,
      });
      req.receiver = follow_id;
      req.purpose = "followed";
      req.init_on = "account";
      req.identity = follow_id;
      next();
    }
  } catch (error) {
    clientError(res, error);
  }
};

// save comment to post
// @desc: save comment to post || @route: POST /api/users/post/saveComment  || @access:public
exports.saveComment = async (req, res, next) => {
  const { _id } = req.user;
  const { post, text, photo, tagged_product, replied_to, replied_under } =
    req.body;
  try {
    const post_owner = await Post.findOne({ post });
    const result = new Comments({
      user: _id,
      post,
      text,
      photo,
      tagged_product,
      replied_to,
      replied_under,
    });
    await result.save();
    await Post.findByIdAndUpdate({ _id: post }, { $inc: { comment_count: 1 } });
    if (typeof replied_to != "undefined") {
      if (replied_to != "") {
        const comment_owner = await Comments.findOne({ replied_to });
        await Comments.findByIdAndUpdate(
          { _id: replied_to },
          { $set: { has_replies: "yes" } }
        );
        if (comment_owner.user != _id) {
          req.receiver = comment_owner.user;
          req.purpose = "commented";
          req.init_on = "post";
          req.identity = replied_to;
          next();
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "Comment saved successfully",
      data: result,
    });
    if (post_owner.user != _id) {
      req.receiver = post_owner.user;
      req.purpose = "commented";
      req.init_on = "post";
      req.identity = post;
      next();
    }
  } catch (error) {
    clientError(res, error);
  }
};

// share to other account
// @desc: share to other account || @route: POST /api/users/post/shareItem  || @access:public
exports.shareItem = async (req, res, next) => {
  const { _id } = req.user;
  const { receiver, item, item_type } = req.body;
  try {
    const result = new Share({
      sharer: _id,
      receiver,
      item,
      item_type,
    });
    await result.save();
    res.status(200).json({
      success: true,
      message: "Shared successfully",
      data: result,
    });
    req.receiver = receiver;
    req.purpose = "shared";
    req.init_on = "account";
    req.identity = receiver;
    next();
  } catch (error) {
    clientError(res, error);
  }
};

// save a social
// @desc: save a social || @route: POST /api/users/post/saveSocial  || @access:public
exports.saveSocial = async (req, res) => {
  const { _id } = req.user;
  const { site, site_type, social_name, social_link } = req.body;
  try {
    const check = await Social.findOne({
      $and: [{ user: _id }, { site: site }, { social_name: social_name }],
    });
    if (check != null) {
      const result = await Social.findByIdAndUpdate(
        {
          _id: check._id,
        },
        {
          $set: {
            social_link: social_link,
          },
        }
      );
    } else {
      const result = new Social({
        user: _id,
        site,
        site_type,
        social_name,
        social_link,
      });
      await result.save();
    }
    res.status(200).json({
      success: true,
      message: "Social Saved successfully",
    });
  } catch (error) {
    clientError(res, error);
  }
};
