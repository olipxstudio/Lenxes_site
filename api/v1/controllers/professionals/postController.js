const User = require("../../models/users/User");
const Site = require("../../models/professionals/Site");
const Widget = require("../../models/professionals/Widget");
const Nav = require("../../models/professionals/Nav");
const Sitebody = require("../../models/professionals/Sitebody");

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