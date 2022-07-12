const User = require("../../models/users/User");
const Site = require("../../models/professionals/Site");
const Nav = require("../../models/professionals/Nav");
const Modal = require("../../models/professionals/Modal");


const { clientError, serverError } = require("../../02_utils/common");


// update a site details
// @desc: update a site details || @route: PATCH /api/professionals/patch/updateSite  || @access:public
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
// @desc: complete a site || @route: PATCH /api/professionals/patch/completeSite  || @access:public
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
// @desc: enter site policy || @route: PATCH /api/professionals/patch/updateSitePolicy  || @access:public
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


// @desc: update site nav || @route: PATCH /api/professionals/patch/updateSiteNav  || @access:public
exports.updateSiteNav = async (req, res) => {
    const {_id} = req.user
    const {nav_id, name, site} = req.body
    try {
        const check_name = await Nav.find(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {name:name}
                ]
            },
            "_id"
        )
        if(check_name==null || check_name==''){
            return clientError(res, "Nav not found")
        }
        const result = await Nav.findOneAndUpdate(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {_id:nav_id}
                ]
            },
            {
                $set:{name}
            }
        )
        res.status(200).json({
            success: true,
            message:"Nav updated successfully",
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}


// @desc: lock or unloak site nav || @route: PATCH /api/professionals/patch/lockUnlockSiteNav  || @access:public
exports.lockUnlockSiteNav = async (req, res) => {
    const {_id} = req.user
    const {nav_id, site} = req.body
    try {
        const check = await Nav.findOne(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {_id:nav_id}
                ]
            },
            "status"
        )
        let status;
        if(check.status=='enabled'){
            status = 'disabled';
        }else{
            status = 'enabled';
        }
        const result = await Nav.findOneAndUpdate(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {_id:nav_id}
                ]
            },
            {
                $set:{status}
            }
        )
        res.status(200).json({
            success: true,
            message:"Nav updated successfully",
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}


// @desc: update call to action in site nav || @route: PATCH /api/professionals/patch/updateCTA  || @access:public
exports.updateCTA = async (req, res) => {
    const {_id} = req.user
    const {site, message, enabled, anchor, type, onclick} = req.body
    try {
        let check;
        if(type=='external'){
            check = { "link": onclick }
        }else if(type=='page'){
            check = { "screen": onclick }
        }else{
            check = { "modal": onclick }
        }
        const result = await Site.findOneAndUpdate(
            {
                $and:[
                    {_id:site},
                    {user:_id}
                ]
            },
            {
                $set:{
                    call_to_action:{
                        message, enabled, anchor, type, onclick: check
                    }
                }
            }
        )
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}


// @desc: update Team members section in site || @route: PATCH /api/professionals/patch/updateTeam  || @access:public
exports.updateTeam = async (req, res) => {
    const {_id} = req.user
    const {sitebody_id, title, subtitle, team, site, screen, cta_enabled, anchor, cta_type, onclick, modal_title, modal_subtitle} = req.body // team array of user(user id) & position
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        const result = await Sitebody.findOneAndUpdate(
            {
                _id: sitebody_id
            },
            {
                $set:{
                    title:{text: title},
                    sub_title: subtitle,
                    call_to_action:{
                        enabled: cta_enabled,
                        anchor,
                        type: cta_type,
                        onclick: check
                    },
                    team
                }
            }
        )
        
        // create modal if cta_type is qual to modal
        const checkModalExist = await Modal.findOne({
            $and:[
                {user:_id},
                {site},
                {widget: result._id}
            ]
        })
        if(checkModalExist.length>0){
            if(cta_type=='modal'){ // update
                const modal = await Modal.findOneAndUpdate(
                    {
                        $and:[
                            {user:_id},
                            {site},
                            {"show_on.modal": checkModalExist._id}
                        ]
                    },
                    {
                        title: modal_title,
                        subtitle: modal_subtitle
                    }
                )
                await modal.save()
            }else{ // delete
                await Modal.findOneAndDelete({widget: result._id})
                await Sitebody.findOneAndDelete({
                    $and:[
                        {user:_id},
                        {site},
                        {"show_on.modal": checkModalExist._id}
                    ]
                })
            }
        }else{
            if(cta_type=='modal'){ // create new
                const modal = new Modal({
                    user:_id,
                    site,
                    screen,
                    widget: result._id,
                    title: modal_title,
                })
                await modal.save()
            }
        }
        // Send notification to all team members - coming soon
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: update Testimonials || @route: PATCH /api/professionals/patch/updateTestimonials  || @access:public
exports.updateTestimonials = async (req, res) => {
    const {_id} = req.user
    const {sitebody_id, title, subtitle, site, screen, after_position, show_on} = req.body
    try {
        const result = Site.aggregate([
            { $lookup:
                {
                    from: 'Nav',
                    localField: 'site',
                    foreignField: '_id',
                    as: 'sitedetails'
                }
            }
        ]).toArray(function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
        });
        
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}
