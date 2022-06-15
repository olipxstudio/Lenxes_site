const User = require("../../models/users/User");
const Store = require("../../models/stores/Store");
const Category = require("../../models/stores/Category");
const Subcategory = require("../../models/stores/Subcategory");
const Subsetcategory = require("../../models/stores/Subsetcategory");

const {
  generateUniqueUserId,
  clientError,
  serverError,
  useValidationError,
  createToken,
} = require("../../02_utils/common");



// create a store
// @desc: create a store || @route: POST /api/stores/post/createStore  || @access:public
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


// create a store category
// @desc: create a store category || @route: POST /api/stores/post/addCategory  || @access:public
exports.addCategory = async (req, res) => {
    const {_id} = req.user
    const {store_id, name} = req.body;
    let order = 1;
    try {
        const cat = await Category.find({
            $and:[
                {user:_id},
                {store:store_id}
            ]
        })
        if(cat.length>0){
            order = cat.length + 1;
        }
        const store = new Category({
            user: _id,
            store: store_id,
            name,
            order
        })
        await store.save()
        res.status(200).json({
            success: true,
            message:"Category created successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}

// create a store subcategory
// @desc: create a store subcategory || @route: POST /api/stores/post/addSubCategory  || @access:public
exports.addSubCategory = async (req, res) => {
    const {_id} = req.user
    const {store_id, name, category} = req.body;
    try {
        const store = new Subcategory({
            user: _id,
            store: store_id,
            name,
            category
        })
        await store.save()
        await Category.findOneAndUpdate(
            {_id:category},
            {$set:{has_sub:'yes'}}
        )
        res.status(200).json({
            success: true,
            message:"Subcategory created successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}

// create a store subsetcategory
// @desc: create a store subsetcategory || @route: POST /api/stores/post/addSubSetCategory  || @access:public
exports.addSubSetCategory = async (req, res) => {
    const {_id} = req.user
    const {store_id, name, category, subcategory} = req.body;
    try {
        const store = new Subsetcategory({
            user: _id,
            store: store_id,
            name,
            category,
            subcategory
        })
        await store.save()
        await Subcategory.findOneAndUpdate(
            {_id:subcategory},
            {$set:{has_set:'yes'}}
        )
        res.status(200).json({
            success: true,
            message:"Subsetcategory created successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}
