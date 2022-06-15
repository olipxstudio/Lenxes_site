const User = require("../../models/users/User");
const Category = require("../../models/stores/Category");
const Subcategory = require("../../models/stores/Subcategory");
const Subsetcategory = require("../../models/stores/Subsetcategory");


const { clientError, serverError } = require("../../02_utils/common");


// update a store
// @desc: update a store || @route: POST /api/store/patch/updateStore  || @access:public
exports.updateStore = async (req, res) => {
    const {_id} = req.user
    const {store_id, shop_name, motto, location, address, phone, email, employee_size, access_pin, business_type, bank, account_number, account_name} = req.body;
    try {
        const store = await Store.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {_id:store_id}
                ]
            },
            {
                $set:{
                    verification:{
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
                    }
                }
            }
        )
        res.status(200).json({
            success: true,
            message:"Store updated successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}

// enter store policy
// @desc: enter store policy || @route: POST /api/store/patch/updateStorePolicy  || @access:public
exports.updateStorePolicy = async (req, res) => {
    const {_id} = req.user
    const {store_id, title, body} = req.body;
    try {
        const store = await Store.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {_id:store_id}
                ]
            },
            {
                $set:{
                    policy:{
                        title, body
                    }
                }
            }
        )
        res.status(200).json({
            success: true,
            message:"Store Updated successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}


// complete a store
// @desc: complete a store || @route: POST /api/store/patch/completeStore  || @access:public
exports.completeStore = async (req, res) => {
    const {_id} = req.user
    const {store_id, type, front_photo, back_photo, id} = req.body;
    try {
        const store = await Store.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {_id:store_id}
                ]
            },
            {
                $set:{
                    verification:{
                        type, front_photo, back_photo, id
                    }
                }
            }
        )
        res.status(200).json({
            success: true,
            message:"Store Updated successfully",
            data: store,
        })
    } catch (error) {
        clientError(res, error)
    }
}



// update a store category
// @desc: update a store category || @route: POST /api/store/patch/updateCategory  || @access:public
exports.updateCategory = async (req, res) => {
    const {_id} = req.user
    const {store_id, category_id, name} = req.body;
    let order = 1;
    try {
        const cat = await Category.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {store:store_id},
                    {_id:category_id}
                ]
            },
            {
                $set:{name}
            }
        )
        res.status(200).json({
            success: true,
            message:"Category Updated successfully",
            data: cat,
        })
    } catch (error) {
        clientError(res, error)
    }
}


// update a store subcategory
// @desc: update a store subcategory || @route: POST /api/store/patch/updateSubCategory  || @access:public
exports.updateSubCategory = async (req, res) => {
    const {_id} = req.user
    const {store_id, name, sub_category_id} = req.body;
    try {
        const cat = await Subcategory.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {store:store_id},
                    {_id:sub_category_id}
                ]
            },
            {
                $set:{name}
            }
        )
        res.status(200).json({
            success: true,
            message:"Subcategory Updated successfully",
            data: cat,
        })
    } catch (error) {
        clientError(res, error)
    }
}


// update a store subsetcategory
// @desc: update a store subsetcategory || @route: POST /api/store/patch/updateSubSetCategory  || @access:public
exports.updateSubSetCategory = async (req, res) => {
    const {_id} = req.user
    const {store_id, name, sub_set_category_id} = req.body;
    try {
        const cat = await Subsetcategory.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {store:store_id},
                    {_id:sub_set_category_id}
                ]
            },
            {
                $set:{name}
            }
        )
        res.status(200).json({
            success: true,
            message:"Subsetcategory Updated successfully",
            data: cat,
        })
    } catch (error) {
        clientError(res, error)
    }
}
