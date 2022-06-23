const User = require("../../models/users/User");
const Site = require("../../models/professionals/Site");
const Widget = require("../../models/professionals/Widget");
const Nav = require("../../models/professionals/Nav");
const Sitebody = require("../../models/professionals/Sitebody");
const Modal = require("../../models/professionals/Modal");

const {
  generateUniqueUserId,
  clientError,
  serverError,
  useValidationError,
  createToken,
} = require("../../02_utils/common");




// create a site
// @desc: create a site || @route: POST /api/professionals/post/createSite  || @access:public
exports.createSite = async (req, res) => {
    const {_id} = req.user
    const {business_name, motto, location, address, phone, email, employee_size, access_pin, business_type} = req.body;
    try {
        // Check if store name exist
        const check_name = await Site.findOne({business_name:business_name})
        if(!check_name){
            const check_email = await Site.findOne({email:email})
            if(check_email){
                return clientError(res, "Email already exist.")
            }
            const {photo, bio} = await User.findById({_id},"fullname photo bio")
            const site = new Site({
                user: _id,
                business_name,
                motto,
                location,
                address,
                phone,
                email,
                employee_size,
                access_pin,
                business_type
            })
            await site.save()
            // create main nav
            const newNav = new Nav({
                name: 'Main',
                site: site._id,
                user: _id,
                order: 1
            })
            await newNav.save()
            // create default banner, this banner is default to all new site
            const banner = new Sitebody({
                user:_id,
                site: site._id,
                screen: newNav._id,
                show_on:{
                    page: true
                },
                order: 1,
                type: 'banner',
                title: business_name,
                sub_title: bio,
                banner:{
                    photo:{
                        url: photo
                    },
                    type: 'banner'
                }
            })
            await banner.save()
            res.status(200).json({
                success: true,
                message:"Site created successfully",
                data: site,
            })
        }else{
            clientError(res, "Site Name already exist.")
        }
    } catch (error) {
        serverError(res, error)
    }
}


// @desc: add widget when new one is created || @route: POST /api/professionals/post/addWidget  || @access:public
exports.addWidget = async (req, res) => {
    const {name, type} = req.body
    try {
        const result = new Widget({
            name,
            model: type
        })
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}


// @desc: add Nav to a site || @route: POST /api/professionals/post/addNav  || @access:public
exports.addNav = async (req, res) => {
    const {_id} = req.user
    const {name, site} = req.body
    let order = 1;
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
        if(check_name!=''){
            return clientError(res, "Nav name already exist")
        }
        const getLen = await Nav.find(
            {
                $and:[
                    {site:site},
                    {user:_id}
                ]
            },
            "_id"
        )
        order = getLen.length + 1;
        const result = new Nav({
            name,
            site,
            user:_id,
            order
        })
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}


// @desc: Add Team to Site || @route: POST /api/professionals/post/addTeam  || @access:public
exports.addTeam = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, team, site, screen, after_position, show_on, cta_enabled, anchor, cta_type, onclick, modal_title} = req.body // team array of user(user id) & position
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'team',
            title,
            sub_title: subtitle,
            call_to_action:{
                enabled: cta_enabled,
                anchor,
                type: cta_type,
                onclick: check
            },
            team
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        // create modal if cta_type is qual to modal
        if(cta_type=='modal'){
            const modal = new Modal({
                user:_id,
                site,
                screen,
                title: modal_title,
            })
            await modal.save()
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



// @desc: Add Testimonials to Site || @route: POST /api/professionals/post/addTestimonials  || @access:public
exports.addTestimonials = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, site, screen, after_position, show_on} = req.body
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'testimonials',
            title,
            sub_title: subtitle
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Core Value to Site || @route: POST /api/professionals/post/addCoreValue  || @access:public
exports.addCoreValue = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, values, site, screen, after_position, show_on} = req.body // values array of title & text
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'values',
            title,
            sub_title: subtitle,
            core_value: values
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Let's Connect to Site || @route: POST /api/professionals/post/addConnect  || @access:public
exports.addConnect = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, site, screen, after_position, show_on} = req.body
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'connect',
            title,
            sub_title: subtitle,
            connect: true
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add PDF Downloadable to Site || @route: POST /api/professionals/post/addDownloadable  || @access:public
exports.addDownloadable = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, file_link, site, screen, after_position, show_on} = req.body
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'downloadable',
            title,
            sub_title: subtitle,
            downloadable: file_link
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Links to Site || @route: POST /api/professionals/post/addLinks  || @access:public
exports.addLinks = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, links, site, screen, after_position, show_on} = req.body // links array of anchor & url
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'links',
            title,
            sub_title: subtitle,
            links: links
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add addSkillSet to Site || @route: POST /api/professionals/post/addSkillSet  || @access:public
exports.addSkillSet = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, skills, site, screen, after_position, show_on} = req.body // skills array of title, years & level
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'skillset',
            title,
            sub_title: subtitle,
            skillset: skills
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Video to Site || @route: POST /api/professionals/post/addVideo  || @access:public
exports.addVideo = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, video_link, site, screen, after_position, show_on} = req.body
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'video',
            title,
            sub_title: subtitle,
            video: video_link
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Past Projects to Site || @route: POST /api/professionals/post/addPastProjects  || @access:public
exports.addPastProjects = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, projects, site, screen, after_position, show_on, cta_enabled, anchor, cta_type, onclick, modal_title} = req.body // projects array of photo, name, for & link
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'projects',
            title,
            sub_title: subtitle,
            call_to_action:{
                enabled: cta_enabled,
                anchor,
                type: cta_type,
                onclick: check
            },
            past_projects: projects
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        // create modal if cta_type is qual to modal
        if(cta_type=='modal'){
            const modal = new Modal({
                user:_id,
                site,
                screen,
                title: modal_title,
            })
            await modal.save()
        }
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Partners to Site || @route: POST /api/professionals/post/addPartners  || @access:public
exports.addPartners = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, partners, site, screen, after_position, show_on} = req.body // partners array of text & logo
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'partners',
            title,
            sub_title: subtitle,
            partners: partners
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Text to Site || @route: POST /api/professionals/post/addText  || @access:public
exports.addText = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, text, site, screen, after_position, show_on, cta_enabled, anchor, cta_type, onclick, modal_title} = req.body
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'text',
            title,
            sub_title: subtitle,
            call_to_action:{
                enabled: cta_enabled,
                anchor,
                type: cta_type,
                onclick: check
            },
            text
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        // create modal if cta_type is qual to modal
        if(cta_type=='modal'){
            const modal = new Modal({
                user:_id,
                site,
                screen,
                title: modal_title,
            })
            await modal.save()
        }
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Section to Site || @route: POST /api/professionals/post/addSection  || @access:public
exports.addSection = async (req, res) => {
    const {_id} = req.user
    const {site, title, subtitle, file_link, file_type, screen, after_position, show_on, cta_enabled, anchor, cta_type, onclick, modal_title} = req.body
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'section',
            title,
            sub_title: subtitle,
            call_to_action:{
                enabled: cta_enabled,
                anchor,
                type: cta_type,
                onclick: check
            },
            section:{
                file: file_link,
                type: file_type
            }
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        // create modal if cta_type is qual to modal
        if(cta_type=='modal'){
            const modal = new Modal({
                user:_id,
                site,
                screen,
                title: modal_title,
            })
            await modal.save()
        }
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Services to Site || @route: POST /api/professionals/post/addServices  || @access:public
exports.addServices = async (req, res) => {
    const {_id} = req.user
    const {site, title, subtitle, model, services, screen, after_position, show_on, cta_enabled, anchor, cta_type, onclick, modal_title} = req.body // services array of photo, title, description
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'services',
            title,
            sub_title: subtitle,
            model,
            call_to_action:{
                enabled: cta_enabled,
                anchor,
                type: cta_type,
                onclick: check
            },
            services
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        // create modal if cta_type is qual to modal
        if(cta_type=='modal'){
            const modal = new Modal({
                user:_id,
                site,
                screen,
                title: modal_title,
            })
            await modal.save()
        }
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Stats to Site || @route: POST /api/professionals/post/addStats  || @access:public
exports.addStats = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, stats, site, screen, after_position, show_on} = req.body // stats array of number & description
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'stats',
            title,
            sub_title: subtitle,
            stats
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Horizontal Card to Site || @route: POST /api/professionals/post/addHorizontalCard  || @access:public
exports.addHorizontalCard = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, site, hcards, screen, after_position, show_on} = req.body // hcards array of photo, title & description
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'hcards',
            title,
            sub_title: subtitle,
            card: hcards
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Experience to Site || @route: POST /api/professionals/post/addExperience  || @access:public
exports.addExperience = async (req, res) => {
    const {_id} = req.user
    const {title, subtitle, site, experiences, screen, after_position, show_on} = req.body // experiences array of workplace, duties, from & to
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'experience',
            title,
            sub_title: subtitle,
            experience: experiences
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}



// @desc: Add Banner to Site || @route: POST /api/professionals/post/addBanner  || @access:public
exports.addBanner = async (req, res) => {
    const {_id} = req.user
    const {site, title, subtitle, model, social, banner_type, photo_type, photo_url, photo_height, font_size, colour, font_family, font_case, screen, after_position, show_on, cta_enabled, anchor, cta_type, onclick, modal_title} = req.body
    let check;
    if(cta_type=='external'){
        check = { "link": onclick }
    }else if(cta_type=='page'){
        check = { "screen": onclick }
    }else{
        check = { "modal": onclick }
    }
    try {
        let order = after_position + 1;
        const result = new Sitebody({
            user:_id,
            site,
            screen,
            show_on: show_on === "page" ? { page:true } : { modal:show_on },
            order,
            type: 'banner',
            title,
            sub_title: subtitle,
            social,
            model,
            call_to_action:{
                enabled: cta_enabled,
                anchor,
                type: cta_type,
                onclick: check
            },
            banner:{
                type: banner_type,
                photo:{
                    type: photo_type,
                    url: photo_url,
                    height: photo_height
                },
                properties:{
                    font_size,
                    colour,
                    font_family,
                    case: font_case
                }
            }
        })
        // update others order before saving
        await Sitebody.updateMany(
            {
                $and:[
                    {site:site},
                    {user:_id},
                    {screen:screen},
                    {show_on: show_on === "page" ? { page:true } : { modal:show_on }},
                    {status:'active'},
                    {order: {$gt: after_position}}
                ]
            },
            {
                $inc:{order: 1}
            }
        )
        await result.save()
        // create modal if cta_type is qual to modal
        if(cta_type=='modal'){
            const modal = new Modal({
                user:_id,
                site,
                screen,
                title: modal_title,
            })
            await modal.save()
        }
        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        serverError(res, error)
    }
}
