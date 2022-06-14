const User = require("../../models/users/User");
const Site = require("../../models/professionals/Site");
const { clientError, serverError } = require("../../02_utils/common");


// update a site details
// @desc: update a site details || @route: POST /api/professionals/patch/updateSite  || @access:public
exports.updateSite = async (req, res) => {
    const {_id} = req.user
    const {site_id, business_name, motto, location, address, phone, email, employee_size, access_pin, business_type} = req.body;
    try {
        const site = await Site.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {_id:site_id}
                ]
            },
            {
                $set:{
                    verification:{
                        business_name,
                        motto,
                        location,
                        address,
                        phone,
                        email,
                        employee_size,
                        access_pin,
                        business_type
                    }
                }
            }
        )
        res.status(200).json({
            success: true,
            message:"Site created successfully",
            data: site,
        })
    } catch (error) {
        clientError(res, error)
    }
}

// complete a site
// @desc: complete a site || @route: POST /api/professionals/patch/completeSite  || @access:public
exports.completeSite = async (req, res) => {
    const {_id} = req.user
    const {site_id, type, front_photo, back_photo, id} = req.body;
    try {
        const site = await Site.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {_id:site_id}
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
            message:"Site Updated successfully",
            data: site,
        })
    } catch (error) {
        clientError(res, error)
    }
}

// enter site policy
// @desc: enter site policy || @route: POST /api/professionals/patch/updateSitePolicy  || @access:public
exports.updateSitePolicy = async (req, res) => {
    const {_id} = req.user
    const {site_id, title, body} = req.body;
    try {
        const site = await Site.findOneAndUpdate(
            {
                $and:[
                    {user:_id},
                    {_id:site_id}
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
            message:"Site Updated successfully",
            data: site,
        })
    } catch (error) {
        clientError(res, error)
    }
}
