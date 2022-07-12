const User = require("../../models/users/User");
const Store = require("../../models/stores/Store");
const Category = require("../../models/stores/Category");
const Subcategory = require("../../models/stores/Subcategory");
const Subsetcategory = require("../../models/stores/Subsetcategory");
const Orders = require("../../models/stores/Orders");
const Orderstatus = require("../../models/stores/Orderstatus");
const Payout = require("../../models/stores/Payout");
const Payoutpercent = require("../../models/admin/Payoutpercent");

const {
  generateUniqueUserId,
  clientError,
  serverError,
  useValidationError,
  createToken,
} = require("../../02_utils/common");
const Product = require("../../models/stores/Product");

// create a store
// @desc: create a store || @route: POST /api/stores/post/createStore  || @access:public
exports.createStore = async (req, res) => {
  const { _id } = req.user;
  const {
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
    account_name,
  } = req.body;
  try {
      // Check if store name exist
      const check_name = await Store.findOne({shop_name:shop_name})
      if(!check_name){
        const check_email = await Store.findOne({email:email})
        if(check_email){
            return clientError(res, "Email already exist.")
        }
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
            account_name,
          });
          await store.save();
          res.status(200).json({
            success: true,
            message: "Store created successfully",
            data: store,
          });
      }else{
          clientError(res, "Store Name already exist.")
      }
  } catch (error) {
    serverError(res, error);
  }
};

// create a store category
// @desc: create a store category || @route: POST /api/stores/post/addCategory  || @access:public
exports.addCategory = async (req, res) => {
  const { _id } = req.user;
  const { store_id, name } = req.body;
  let order = 1;
  try {
    const cat = await Category.find({
      $and: [{ user: _id }, { store: store_id }],
    });
    if (cat.length > 0) {
      order = cat.length + 1;
    }
    const store = new Category({
      user: _id,
      store: store_id,
      name,
      order,
    });
    await store.save();
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: store,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// create a store subcategory
// @desc: create a store subcategory || @route: POST /api/stores/post/addSubCategory  || @access:public
exports.addSubCategory = async (req, res) => {
  const { _id } = req.user;
  const { store_id, name, category } = req.body;
  try {
    const store = new Subcategory({
      user: _id,
      store: store_id,
      name,
      category,
    });
    await store.save();
    await Category.findOneAndUpdate(
      { _id: category },
      { $set: { has_sub: "yes" } }
    );
    res.status(200).json({
      success: true,
      message: "Subcategory created successfully",
      data: store,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// create a store subsetcategory
// @desc: create a store subsetcategory || @route: POST /api/stores/post/addSubSetCategory  || @access:public
exports.addSubSetCategory = async (req, res) => {
  const { _id } = req.user;
  const { store_id, name, category, subcategory } = req.body;
  try {
    const store = new Subsetcategory({
      user: _id,
      store: store_id,
      name,
      category,
      subcategory,
    });
    await store.save();
    await Subcategory.findOneAndUpdate(
      { _id: subcategory },
      { $set: { has_set: "yes" } }
    );
    res.status(200).json({
      success: true,
      message: "Subsetcategory created successfully",
      data: store,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// create a new product
// @desc: create a new product || @route: POST /api/stores/post/product/new  || @access:public
exports.addProduct = async (req, res) => {
  const { _id } = req.user;
  const {
    store_id,
    name,
    category,
    subcategory,
    subsetcategory,
    description,
    images,
    condition,
    featured,
    upc,
    brand,
    related_products,
    customer_input,
    input_type,
    stock_control,
    variants,
  } = req.body;

  // get all products count and add 1 as sku
  const products = await Product.find({
    $and: [{ user: _id }, { store: store_id }],
  });
  let sku = 100;
  if (products.length > 0) {
    sku = products.length + 100;
  }

  try {
    const new_product = new Product({
      user: _id,
      store: store_id,
      sku: sku,
      title: name,
      // photo is an array of images
      photo: images,
      description: description,
      category: category,
      subcategory: subcategory,
      subsetcategory: subsetcategory,
      condition: condition,
      featured: featured,
      attribute: {
        upc: upc,
        brand: brand,
      },
      related_products: related_products,
      customer_input: customer_input,
      input_type: input_type,
      stock_control: stock_control,
      variants: variants,
      // variant is an array of objects
    //   variant: [
    //       {
    //         "color_name": "Green",
    //         "color_code": "#00ff00",
    //         "color_thumbnail": "https://www.example.com/green.jpg",
    //         "items":[
    //          {
    //             "size": "S",
    //             "price": 100,
    //             "quantity": 1
    //          },
    //          {
    //             "size": "M",
    //             "price": 100,
    //             "quantity": 2
    //          }
    //        ]
    //     },
    //    {
    //         "color_name": "Blue",
    //         "color_code": "#0000ff",
    //         "color_thumbnail": "https://www.example.com/blue.jpg",
    //         "items":[
    //          {
    //             "size": "S",
    //             "price": 100,
    //             "quantity": 1
    //          },
    //          {
    //             "size": "S",
    //             "price": 100,
    //             "quantity": 1
    //          }
    //        ]
    //     }
    // ]
    });

    await new_product.save();
    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: new_product,
    });
  } catch (error) {
    serverError(res, error);
  }
};


// @desc: make an order - save order || @route: POST /api/stores/post/makeOrder  || @access:public
exports.makeOrder = async (req, res) => {
    const { _id } = req.user;
    const { store_id, name, category } = req.body;
    try {
      const store = new Subcategory({
        user: _id,
        store: store_id,
        name,
        category,
      });
      await store.save();
      await Category.findOneAndUpdate(
        { _id: category },
        { $set: { has_sub: "yes" } }
      );
      res.status(200).json({
        success: true,
        message: "Subcategory created successfully",
        data: store,
      });
    } catch (error) {
      serverError(res, error);
    }
};


// @desc: validate token from seller and set payout || @route: POST /api/stores/post/completeOrders  || @access:public
exports.completeOrders = async (req, res) => {
    const { _id } = req.user;
    const { order_id, token } = req.body;
    try {
        const store = await Orderstatus.findOneAndUpdate(
            {
                $and:[
                    {_id: order_id},
                    {"delivery_token.buyer": token}
                ]
            },
            {
                $set: {status: 'completed'}
            }
        );
        await Orders.updateMany(
            {
                $and:[
                    {transaction_id: store.transaction_id},
                    {store: store.store}
                ]
            },
            {
                $set: {status: 'completed'}
            }
        );
        
        // Get countries to compare local or international transaction
        const type_of_sales = await Orderstatus.findOne({_id: order_id},"buyer seller store").populate("buyer","address.country").populate("seller","address.country")
        let buyer_country = type_of_sales.buyer.address.country;
        let seller_country = type_of_sales.seller.address.country;
        // Get admin fees
        const admin_fees = await Payoutpercent.findOne()
        let local_fess = admin_fees.local_fess;
        let international_fee = admin_fees.international_fee;
        let charge_percent = 0;
        if(buyer_country==seller_country){
            charge_percent = local_fess;
        }else{
            charge_percent = international_fee;
        }
        
        if(store==null){
            res.status(200).json({
                success: false,
                message: "Token incorrect"
            });
        }else{
            let divide = charge_percent / 100;
            let charges = store.total_amount * divide;
            let due = store.total_amount - charges;
            const payout = new Payout({
                store: store.store,
                amount_due: due,
                settled_amount: 0,
                batch: 1,
                transaction_id: store.transaction_id
            })
            await payout.save()
            res.status(200).json({
                success: true,
                message: "Order Completed successfully",
                data: store,
            });
        }
    } catch (error) {
        serverError(res, error);
    }
};