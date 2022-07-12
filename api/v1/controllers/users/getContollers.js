const moment = require("moment");
const User = require("../../models/users/User");
const { clientError, serverError } = require("../../02_utils/common");
const Post = require("../../models/users/Post");
const Niche = require("../../models/users/Niche");
const Nichequestion = require("../../models/users/Nichequestion");
const Discuss = require("../../models/users/Discuss");
const DiscussChat = require("../../models/users/DiscussChat");
const Follow = require("../../models/users/Follow");
const Comments = require("../../models/users/Comments");
const Share = require("../../models/users/Share");
const Saved = require("../../models/users/Saved");
const Notification = require("../../models/users/Notification");
const { path } = require("@ffmpeg-installer/ffmpeg");
const Product = require("../../models/stores/Product");
const DiscussChatNotify = require("../../models/users/DiscussChatNotify");
const Cart = require("../../models/users/Cart");
const CartCollection = require("../../models/users/CartCollection");
const Site = require("../../models/professionals/Site");
const Sitebody = require("../../models/professionals/Sitebody");
const StoreNotification = require("../../models/stores/Notification");
const Orders = require("../../models/stores/Orders");
const Orderstatus = require("../../models/stores/Orderstatus");

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
    const data = await User.findById(_id, { password: 0 });
    res.status(200).json({
      success: true,
      data,
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
      .populate("creator", "fullname username photo")
      .populate("members", "fullname username photo");
    
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
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
  const { niche_id } = req.body;
  try {
    const result = await Niche.findOne({ _id: niche_id }).populate(
      "creator",
      "fullname username photo"
    );
    const members = await Nichemember.find({
      $and: [{ niche: result._id }, { status: "active" }],
    }).limit(5);
    res.status(200).json({
      success: true,
      result,
      members,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get single niches members
// @desc: get single niches members || @route: GET /api/users/get/singleNicheMembers/number - 20 per time  || @access:users
exports.getSingleNichesMembers = async (req, res) => {
  const { _id } = req.user;
  const { niche_id } = req.body;
  const number = req.params.number;
  try {
    const data = await Nichemember.find({
      $and: [{ niche: niche_id }, { status: "active" }],
    })
      .limit(20)
      .skip(number)
      .populate("member", "fullname username photo");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get single niches questions
// @desc: get single niches questions || @route: GET /api/users/get/singleNicheQuestions/number - 10 per time  || @access:users
exports.getSingleNichesQuestions = async (req, res) => {
  const { _id } = req.user;
  const { niche_id } = req.body;
  const number = req.params.number;
  try {
    const data = await Nichequestion.find({
      $and: [{ niche: niche_id }, { status: "active" }],
    })
      .sort("-createdAt")
      .limit(10)
      .skip(number)
      .populate("user", "fullname username photo");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get discuss details
// @desc: gget discuss details || @route: GET /api/users/get/getDiscussDetails  || @access:users
exports.getDiscussDetails = async (req, res) => {
  const { _id } = req.user;
  const { discuss_id } = req.body;
  try {
    const data = await Discuss.findOne({ _id: discuss_id }).populate("people");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get discuss chats
// @desc: gget discuss chats || @route: GET /api/users/get/getDiscussChats  || @access:users
exports.getDiscussChats = async (req, res) => {
  const { _id } = req.user;
  const { discuss_id } = req.body;
  try {
    const data = await DiscussChat.find({ discuss: discuss_id })
      .populate("user", "fullname username photo")
      .populate("attached");
    res.status(200).json({
      success: true,
      data,
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
    const data = await Follow.find({ follow: _id })
      .limit(20)
      .skip(number)
      .populate("user", "fullname username photo");
    res.status(200).json({
      success: true,
      data,
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
    const data = await Follow.find({ user: _id })
      .limit(20)
      .skip(number)
      .populate("follow", "fullname username photo");
    res.status(200).json({
      success: true,
      data,
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
    const data = await Post.findOne({ post_id }).populate("user","fullname username photo").populate("tagged_product","title photo category condition variants");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get single post comments
// @desc: get single post comments || @route: GET /api/users/get/getPostComments  || @access:users
exports.getPostComments = async (req, res) => {
  const { _id } = req.user;
  const { post_id } = req.body;
  try {
    const data = await Comments.find({ post: post_id })
      .populate("user", "fullname username photo")
      .populate("replied_to", "text photo tagged_product")
      .populate("tagged_product");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get single posts with linked word
// @desc: get single posts with linked word || @route: GET /api/users/get/getPostwithLinkedWord/number  || @access:users
exports.getPostwithLinkedWord = async (req, res) => {
  const { _id } = req.user;
  const { word } = req.body;
  const { number } = req.params;
  try {
    const data = await Post.find({ linked_word: word })
      .limit(5)
      .skip(number)
      .populate("user", "fullname username photo");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all items shared to me
// @desc: get all items shared to me || @route: GET /api/users/get/getShared/number - 10 per time  || @access:users
exports.getShared = async (req, res) => {
  const { _id } = req.user;
  const { number } = req.params;
  try {
    const data = await Share.find({ _id }).limit(10).skip(number).sort("-date");
    const result = await Promise.all(
      data.map(async (item) => {
        const another = await Share.find({ _id: item._id }).populate({
          path: "item",
          model: item.item_type,
        });
        return another;
      })
    );
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all user saved post
// @desc: get all user saved post || @route: GET /api/users/get/getSaved/number - 10 per time  || @access:users
exports.getSaved = async (req, res) => {
  const { _id } = req.user;
  const { number } = req.params;
  try {
    const data = await Saved.find({ _id })
      .limit(10)
      .skip(number)
      .sort("-date")
      .populate("post_owner_id", "fullname username photo")
      .populate("post_id");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all user notifications
// @desc: get all user notifications || @route: GET /api/users/get/getNotifications/number - 20 per time  || @access:users
exports.getNotifications = async (req, res) => {
  const { _id } = req.user;
  const { number } = req.params;
  try {
    const data = await Notification.find({ receiver: _id })
      .limit(20)
      .skip(number)
      .sort("-init_date")
      .populate("sender", "fullname username photo");
    // populate identity
    const result = await Promise.all(
      data.map(async (item) => {
        // update status to read
        await Notification.findByIdAndUpdate(
          { _id: item._id },
          { $set: { status: "read", read_date: Date.now() } }
        );
        const { post_id } = item.identity;
        if (post_id != null) {
          return await Notification.findOne({ _id: item._id }).populate({
            path: "identity.post_id",
            model: Post,
          });
        } else {
          return await Notification.findOne({ _id: item._id }).populate({
            path: "identity.account_id",
            model: User,
          });
        }
      })
    );
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get explore posts
// @desc: get explore posts || @route: GET /api/users/get/getExplore/number - 20 per time  || @access:users
exports.getExplore = async (req, res) => {
  const { _id } = req.user;
  const { number } = req.params;
  try {
    const data = await Post.find({ status: "Published" })
      .limit(20)
      .skip(number)
      .sort("-like_count -comment_count")
      .populate("user", "fullname username photo");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get product details
// @desc: get product details || @route: GET /api/users/get/getProductDetails/:id || @access:users
exports.getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Product.findById(id).sort("-date");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get tagged product for a post
// @desc: get tagged product for a post || @route: GET /api/users/get/getTaggedProduct/:id || @access:users
exports.getTaggedProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Product.find({
      $and: [{ status: "Published" }, { _id: { $in: id } }],
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all user discussions and get discusstion chat notifications count for each discussion
// @desc: get all user discussions and get discusstion chat notifications count for each discussion || @route: GET /api/users/get/getDiscussions || @access:users
exports.getDiscussions = async (req, res) => {
  const { _id } = req.user;
  // get current date and time
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const currentTimePlus = currentTime + 1000 * 60 * 60 * 24 * 7;
  const currentTimePlusDate = new Date(currentTimePlus);
  const currentTimePlusDateString = currentTimePlusDate.toISOString();

  try {
    //  get all discussions where user is creator or user is in member and  expires_in is greater than current date
    const discussions = await Discuss.find({
      $and: [
        {
          $or: [{ creator: _id }, { members: _id }],
          expires_in: { $lte: currentTimePlusDateString },
        },
      ],
    })
      .sort("-date")
      .populate("creator", "fullname username photo")
      .populate("members", " photo")
      .populate("discuss_item");

    // for each discussion, get count from DiscussChatNotify where discuss is discussion._id
    const result = await Promise.all(
      discussions.map(async (item) => {
        const { members } = item;
        const membersLength = members.length;
        const count = await DiscussChatNotify.findOne({ discuss: item._id });
        return { ...item._doc, notificationCount: count?.count, membersLength };
      })
    );

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    serverError(res, error);
  }
};


// @desc: get products by search that belongs to me to be tagged || @route: GET /api/users/get/getProductToTagged || @access:users
exports.getProductToTagged = async (req, res) => {
    const { _id } = req.user;
    const { keyword } = req.body;
    try {
        const result = await Product.find(
            {
                $and: [
                    {title: new RegExp('.*' + keyword + '.*', 'i')},
                    {user: _id},
                    {stock_control: true},
                    {status: 'active'}
                ],
            },
            "title photo category condition variants"
        )
        .populate("category", "name");
        
        res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
}


// @desc: get single product details || @route: GET /api/users/get/getSingleProduct || @access:users
exports.getSingleProduct = async (req, res) => {
    const { _id } = req.user;
    const { product_id } = req.body;
    try {
        const result = await Product.findOne(
            {
                $and: [
                    {_id: product_id},
                    {stock_control: true},
                    {status: 'active'}
                ],
            }
        )
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("subsetcategory", "name")
        .populate("user", "fullname photo username")
        .populate("store", "shop_name");
        const others = await Product.find(
            {
                $and: [
                    {user: result.user._id},
                    {stock_control: true},
                    {status: 'active'},
                    {_id: {$nin: product_id}}
                ],
            },
            "title photo description variants"
        )
        .limit(6);
        
        res.status(200).json({
            success: true,
            result,
            others
        });
    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
}


// @desc: get random products for single product page || @route: GET /api/users/get/getRandomProducts/number - 6 per time || @access:users
exports.getRandomProducts = async (req, res) => {
    const { _id } = req.user;
    const number = req.params.number;
    try {
        const result = await Product.find(
            {
                $and: [
                    {stock_control: true},
                    {status: 'active'}
                ],
            },
            "user store title photo description variants"
        )
        .limit(6)
        .skip(number)
        .populate("user", "fullname photo username")
        .populate("store", "shop_name");
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
}


// @desc: get all user collections || @route: GET /api/users/get/getCartCollections || @access:users
exports.getCartCollections = async (req, res) => {
    const { _id } = req.user;
    try {
        const result = await CartCollection.find(
            {
                $and:[
                    {user:_id},
                    {status:'active'}
                ]
            }
        )
        const data = await Promise.all(
            result.map(async(items)=>{
                // Count products in collection
                const count = await Cart.find({collection_id:items._id}).count()
                // Get all products in collection - this is for sampling the product to the user until the updated cart items are fetched with full details, when fetch is done then update cart - This would be done @ getCartProducts API
                const details = await Cart.find({collection_id:items._id}).populate("user","fullname photo username").populate("product_details.product","sku title photo condition variants").populate("store")
                return {...items.toJSON(), num: count, cart: details};
            })
        )
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
}


// @desc: get all product in a cart collection || @route: GET /api/users/get/getCartQualifiedProducts || @access:users
exports.getCartQualifiedProducts = async (req, res) => {
    const { _id } = req.user;
    const { collection_id } = req.body;
    try {
        const getCart = await Cart.find({
            $and:[
                {collection_id},
                {user:_id},
                {status:'active'}
            ]
        })
        const resolve = await Promise.all(
            getCart.map(async(items)=>{
                const get = await Product.aggregate([
                    {
                        $match: {
                            _id: items.product_details.product
                        }
                    },
                    {
                        $project: {
                            variants: {
                                $first: {
                                    $filter: {
                                        input: "$variants",
                                        cond: {
                                            $eq: [
                                                "$$this._id",
                                                items.product_details.variant
                                            ]
                                        }
                                    }
                                }
                            },
                            _id: 1,
                            user: 1,
                        }
                    },
                    {
                        $set: {
                            "variants.items": {
                                $filter: {
                                    input: "$variants.items",
                                    cond: {
                                        $eq: [
                                            "$$this._id",
                                            items.product_details.variant_item
                                        ]
                                    }
                                }
                            },
                            _id: "$$REMOVE"
                        }
                    }
                ]);
                let cartQty = items.quantity;
                let prodQty = get[0].variants.items[0].quantity;
                let owner_id = get[0].user;
                if(cartQty>prodQty){
                    if(prodQty==0){
                        await Cart.findOneAndUpdate(
                            {_id: items._id},
                            {
                                $set:{
                                    quantity: prodQty,
                                    status: 'outbond',
                                    delivery:{
                                        payment_set: false,
                                        type: 'home',
                                        pickup_location: null,
                                        fee: 0
                                    }
                                }
                            }
                        )
                    }else{
                        await Cart.findOneAndUpdate(
                            {_id: items._id},
                            {
                                $set:{
                                    quantity: prodQty,
                                    delivery:{
                                        payment_set: false,
                                        type: 'home',
                                        pickup_location: null,
                                        fee: 0
                                    }
                                }
                            }
                        )
                        // Only send notification when item is still in stock
                        // First find any notification that concerns this delivery and delete
                        await StoreNotification.findOneAndDelete({
                            $and:[
                                {sender: _id},
                                {receiver: owner_id},
                                {store: items.store},
                                {type: 'delivery'},
                                {"delivery.cart_id": items._id}
                            ]
                        })
                        // send notification to seller for new delivery fee
                        const getLocation = await User.findOne({_id})
                        const location_concat = getLocation.address.address_line1+', '+getLocation.address.lga+', '+getLocation.address.state+', '+getLocation.address.country;
                        const sendNotification = new StoreNotification({
                            sender:_id,
                            receiver: owner_id,
                            store: items.store,
                            type:'delivery',
                            delivery:{
                                product: items.product_details.product,
                                location:location_concat,
                                cart_id: items._id
                            }
                        })
                        await sendNotification.save() // End notification
                    }
                }
            })
        )
        const getQualifiedItems = await Cart.find({
            $and:[
                {collection_id},
                {user:_id},
                {status:'active'},
                {"delivery.payment_set":true}
            ]
        }).populate("user","fullname photo username").populate("product_details.product","sku title photo condition variants").populate("store")
        res.status(200).json({
            success: true,
            getQualifiedItems
        });
    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
}


// @desc: get all product in a cart collection that are not qualified for payment || @route: GET /api/users/get/getCartNotQualified || @access:users
exports.getCartNotQualified = async (req, res) => {
    const { _id } = req.user;
    const { collection_id } = req.body;
    try {
        const getNotQualifiedItems = await Cart.find({
            $and:[
                {collection_id},
                {user:_id},
                {status:'active'},
                {"delivery.payment_set":false}
            ]
        }).populate("user","fullname photo username").populate("product_details.product","sku title photo condition variants").populate("store")
        res.status(200).json({
            success: true,
            count: getNotQualifiedItems.length,
            getNotQualifiedItems
        });
    } catch (error) {
        console.log(error);
        serverError(res, error);
    }
}



// @desc: Get user details and four most recent posts - fro previewing user to follow details on empty feed || @route: GET /api/users/get/getFeedUserPreview  || @access:public
exports.getFeedUserPreview = async (req, res) => {
    const { _id } = req.user;
    const { user_id } = req.body;
    try {
        const getDetails = await User.findOne({_id: user_id})
        const getFourPosts = await Post.find(
            {
                $and:[
                    {user: user_id},
                    {status:'Published'}
                ]
            }
        ).sort('-createdAt')
        .limit(4)
        res.status(200).json({
            success: true,
            getDetails,
            getFourPosts
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: Get user Site brand name and Hero - for previewing user business on post || @route: GET /api/users/get/getSitePreview  || @access:public
exports.getSitePreview = async (req, res) => {
    const { _id } = req.user;
    const { user_id } = req.body;
    try {
        const getDetails = await Site.findOne({user: user_id},"business_name motto")
        const getHero = await Sitebody.findOne(
            {
                $and:[
                    {site: getDetails._id},
                    {"show_on.page":true},
                    {order:1},
                    {user: user_id},
                    {type:'banner'}
                ]
            },
            "title sub_title banner"
        ).sort('-createdAt')
        .limit(1)
        res.status(200).json({
            success: true,
            getDetails,
            getHero
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: Get suggested people base on user industry - for explore page || @route: GET /api/users/get/getSuggestedPeople/number - 7 per time || @access:public
exports.getSuggestedPeople = async (req, res) => {
    const { _id } = req.user;
    const { number } = req.params;
    try {
        const data = await User.findOne({_id},"industry")
        const result = await User.find({
            $and:[
                {industry:data.industry},
                {status:'active'}
            ]
        }).limit(7)
        .skip(number)
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: Get explore User search - for explore page || @route: GET /api/users/get/getExploreUserSearch  || @access:public
exports.getExploreUserSearch = async (req, res) => {
    const { _id } = req.user;
    const { keyword } = req.body;
    try {
        const result = await User.find(
            {
                $and:[
                    {fullname: new RegExp('.*' + keyword + '.*', 'i')},
                    {status: 'active'}
                ]
            },
            "fullname photo profession username"
        )
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: Get explore Product search - for explore page || @route: GET /api/users/get/getExploreProductSearch  || @access:public
exports.getExploreProductSearch = async (req, res) => {
    const { _id } = req.user;
    const { keyword } = req.body;
    try {
        const result = await Product.find(
            {
                $and:[
                    {title: new RegExp('.*' + keyword + '.*', 'i')},
                    {status: 'active'}
                ]
            },
            "title photo category subcategory subsetcategory condition"
        )
        .populate("category","name")
        .populate("subcategory","name")
        .populate("enquiry.product");
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: Get explore Product - Curated || @route: GET /api/users/get/getExploreProducts/:number - 12 per time || @access:public
exports.getExploreProducts = async (req, res) => {
    const { _id } = req.user;
    const { number } = req.params;
    try {
        const result = await Product.find(
            {status: 'active'},
            "title photo category subcategory subsetcategory condition"
        )
        .limit(12)
        .skip(number)
        .populate("category","name")
        .populate("subcategory","name")
        .populate("enquiry.product");
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};



// @desc: Get product reviews twelve per time - Curated || @route: GET /api/users/get/getProductReviews/:number - 12 per time || @access:public
exports.getProductReviews = async (req, res) => {
    const { _id } = req.user;
    const { number } = req.params;
    const { product_id } = req.body;
    try {
        const result = await Comments.find(
            {
                $and:[
                    {post: product_id},
                    {type: "Product"},
                    {status: "active"}
                ]
            },
            "user post text photo"
        )
        .limit(12)
        .skip(number)
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};


// @desc: get all user orders - pending or done - 15 per time || @route: GET /api/users/get/getAllOrders/:status/:number  || @access:public
exports.getAllOrders = async (req, res) => {
    const { _id } = req.user;
    const { status, number } = req.params;
    try {
        const result = await Orders.find(
            {
                $and:[
                    {buyer: _id},
                    {status}
                ]
            }
        )
        .limit(15)
        .skip(number)
        .populate("store","shop_name")
        .populate("seller","fullname photo username")
        .populate("order_status_id","payment_status amount shipping total_amount delivery_method delivery_token.buyer")
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};
