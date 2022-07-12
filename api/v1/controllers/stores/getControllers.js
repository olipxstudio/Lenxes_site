const { clientError, serverError } = require("../../02_utils/common");
const { path } = require("@ffmpeg-installer/ffmpeg");
const User = require("../../models/users/User");
const Category = require("../../models/stores/Category");
const Subcategory = require("../../models/stores/Subcategory");
const Subsetcategory = require("../../models/stores/Subsetcategory");
const Product = require("../../models/stores/Product");
const StoreNotification = require("../../models/stores/Notification");
const Store = require("../../models/stores/Store");
const Structure = require("../../models/stores/Structure");
const Orders = require("../../models/stores/Orders");
const Orderstatus = require("../../models/stores/Orderstatus");
const Payout = require("../../models/stores/Payout");

// get all store categories
// @desc: get all store categories || @route: GET /api/stores/get/getAllStoreCategories  || @access:user
exports.getAllStoreCategories = async (req, res) => {
  const { _id } = req.user;
  const { store_id } = req.body;
  try {
    const result = await Category.find(
      {
        $and: [{ store: store_id }, { status: "active" }],
      },
      "name has_sub product_count"
    );
    const sub = await Promise.all(
      result.map(async (cat) => {
        const subcat = await Subcategory.find(
          {
            $and: [
              { store: store_id },
              { category: cat._id },
              { status: "active" },
            ],
          },
          "name has_set"
        );
        const set = await Promise.all(
          subcat.map(async (subcat) => {
            const setcat = await Subsetcategory.find(
              {
                $and: [
                  { store: store_id },
                  { subcategory: subcat._id },
                  { status: "active" },
                ],
              },
              "name"
            );
            return { ...subcat.toJSON(), subsetcategory: setcat };
          })
        );
        return { ...cat.toJSON(), subcategory: set };
      })
    );
    res.status(200).json({
      success: true,
      count: result?.length,
      data: sub,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all store sub categories
// @desc: get all store sub categories || @route: GET /api/stores/get/getAllStoreSub_Categories  || @access:user
exports.getAllStoreSub_Categories = async (req, res) => {
  const { _id } = req.user;
  const { store_id, category_id } = req.body;
  try {
    const result = await Subcategory.find(
      {
        $and: [
          { store: store_id },
          { category: category_id },
          { status: "active" },
        ],
      },
      "name has_set"
    );
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all store sub set categories
// @desc: get all store sub set categories || @route: GET /api/stores/get/getAllStoreSub_SetCategories  || @access:user
exports.getAllStoreSub_SetCategories = async (req, res) => {
  const { _id } = req.user;
  const { store_id, subcategory_id } = req.body;
  try {
    const result = await Subcategory.find(
      {
        $and: [
          { store: store_id },
          { subcategory: subcategory_id },
          { status: "active" },
        ],
      },
      "name"
    );
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all store product
// @desc: get all store products || @route: GET /api/stores/get/store/products  || @access:user
exports.getProducts = async (req, res) => {
  const { _id } = req.user;
  try {
    const result = await Product.find({ user: _id }).sort("-date");
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};


// @desc: get products from category, sub and set || @route: GET /api/stores/get/getCatProducts/path(cat,sub,set)/number - 12 per time  || @access:user
exports.getCatProducts = async (req, res) => {
    const { _id } = req.user;
    const { path, number } = req.params;
    const { catsubset_id, store } = req.body;
    try {
        let query;
        if(path=='cat'){
            query = {"category":catsubset_id}
        }else if(path=='sub'){
            query = {"subcategory":catsubset_id}
        }else{
            query = {"subsetcategory":catsubset_id}
        }
        const result = await Product.find(
            {
                $and:[
                    {status: 'active'},
                    {stock_control:true},
                    {store:store},
                    query
                ]
            },
            "user store title photo condition variants"
        ).sort("-createdAt")
        .limit(12)
        .skip(number)
        .populate("user","fullname username photo")
        .populate("store","shop_name location");
       
      res.status(200).json({
        success: true,
        count: result?.length,
        data: result
      });
    } catch (error) {
      serverError(res, error);
    }
};


// @desc: get store new arrivals products || @route: GET /api/stores/get/getNewArrivals/number - 6 per time  || @access:user
exports.getNewArrivals = async (req, res) => {
    const { _id } = req.user;
    const { number } = req.params;
    const { store } = req.body;
    try {
        const result = await Product.find(
            {
                $and:[
                    {status: 'active'},
                    {stock_control:true},
                    {store:store}
                ]
            },
            "user store title photo condition variants"
        ).sort("-createdAt")
        .limit(6)
        .skip(number)
        .populate("user","fullname username photo")
        .populate("store","shop_name location");
       
      res.status(200).json({
        success: true,
        count: result?.length,
        data: result
      });
    } catch (error) {
      serverError(res, error);
    }
};


// @desc: get store notifications || @route: GET /api/stores/get/getStoreNotifications/number - 12 per time  || @access:user
exports.getStoreNotifications = async (req, res) => {
    const { _id } = req.user;
    const { store } = req.body;
    const {number} = req.params;
    try {
        const result = await StoreNotification.find(
            {
                $and:[
                    {receiver:_id},
                    {store:store}
                ]
            }
        ).sort("-date")
        .limit(12)
        .skip(number)
        .populate("sender","fullname username photo")
        .populate("delivery.product","sku title photo condition category variants")
        .populate("enquiry.product");
       
      res.status(200).json({
        success: true,
        count: result?.length,
        data: result
      });
    } catch (error) {
      serverError(res, error);
    }
};


// @desc: get store product search result || @route: GET /api/stores/get/getSearchProducts  || @access:user
exports.getSearchProducts = async (req, res) => {
    const { _id } = req.user;
    const { keyword, store } = req.body;
    try {
        const result = await Product.find(
            {
                $and:[
                    {title: new RegExp('.*' + keyword + '.*', 'i')},
                    {store},
                    {status: 'active'}
                ]
            },
            "title photo category subcategory subsetcategory condition"
        )
        .populate("category","name")
        .populate("subcategory","name")
       
      res.status(200).json({
        success: true,
        count: result?.length,
        data: result
      });
    } catch (error) {
      serverError(res, error);
    }
};


// @desc: get random products for store - suggested products || @route: GET /api/stores/get/getRandomProducts/number  || @access:user
exports.getRandomProducts = async (req, res) => {
    const { _id } = req.user;
    const { store } = req.body;
    const { number } = req.params;
    try {
        const result = await Product.find(
            {
                $and:[
                    {store},
                    {status: 'active'}
                ]
            },
            "sku title photo category subcategory subsetcategory condition variants"
        ).limit(12)
        .skip(number)
       
      res.status(200).json({
        success: true,
        count: result?.length,
        data: result
      });
    } catch (error) {
      serverError(res, error);
    }
};


// @desc: get store details and structure || @route: GET /api/stores/get/getStoreDetails  || @access:user
exports.getStoreDetails = async (req, res) => {
    const { _id } = req.user;
    const { user, store } = req.body;
    try {
        const result = await Store.findOne(
            {
                $and:[
                    {user},
                    {_id:store}
                ]
            },
            "shop_name motto location address phone email"
        )
        const structure = await Structure.findOne({store})
        res.status(200).json({
            success: true,
            data: result,
            structure
        });
    } catch (error) {
      serverError(res, error);
    }
};



// @desc: get all store orders - pending or done - 15 per time || @route: GET /api/stores/get/getAllOrders/:status/:number  || @access:user
exports.getAllOrders = async (req, res) => {
    const { _id } = req.user;
    const { status, number } = req.params;
    const { store } = req.body;
    try {
        const result = await Orders.find(
            {
                $and:[
                    {store},
                    {status}
                ]
            }
        )
        .limit(15)
        .skip(number)
        .populate("buyer","fullname photo username")
        .populate("order_status_id","payment_status amount shipping total_amount delivery_method delivery_token.seller")
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};



// @desc: get single order details || @route: GET /api/stores/get/getSingleOrder  || @access:user
exports.getSingleOrder = async (req, res) => {
    const { _id } = req.user;
    const { store, transaction_id } = req.body;
    try {
        const result = await Orderstatus.findOne(
            {
                $and:[
                    {store},
                    {transaction_id}
                ]
            }
        )
        .populate("buyer","fullname photo username")
        
        const order = await Orders.find(
            {
                $and:[
                    {store},
                    {transaction_id}
                ]
            },
            "product_details.product delivery quantity"
        )
        .populate({path: "product_details.product", select:"sku photo title condition category subcategory subsetcategory", populate: { path: "category", select:"name" }})
        
        res.status(200).json({
            success: true,
            result,
            order
        });
    } catch (error) {
        serverError(res, error);
    }
};



// @desc: get all payouts, pending and done - 15 per time || @route: GET /api/stores/get/getPayouts/:number  || @access:user
exports.getPayouts = async (req, res) => {
    const { _id } = req.user;
    const { number } = req.params;
    const { store } = req.body;
    try {
        const result = await Payout.find(
            {
                $and:[
                    {store}
                ]
            }
        )
        .limit(15)
        .skip(number)
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};



// @desc: get all store product by status - 15 per time || @route: GET /api/stores/get/getStoreProducts/:status/:number  || @access:user
exports.getStoreProducts = async (req, res) => {
    const { _id } = req.user;
    const { status, number } = req.params;
    const { store } = req.body;
    try {
        const result = await Product.find(
            {
                $and:[
                    {store},
                    {status} // active or trash
                ]
            }
        )
        .limit(15)
        .skip(number)
        .populate("category","name")
        .populate("subcategory","name")
        .populate("subsetcategory","name")
        
        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        serverError(res, error);
    }
};

