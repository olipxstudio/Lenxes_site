const User = require("../../models/users/User");
const Site = require("../../models/professionals/Site");
const Nav = require("../../models/professionals/Nav");
const Widget = require("../../models/professionals/Widget");
const Sitebody = require("../../models/professionals/Sitebody");


const { clientError, serverError } = require("../../02_utils/common");


// @desc: get all enabled site widgets || @route: GET /api/professionals/get/getallWidgets  || @access:public
exports.getallWidgets = async (req, res) => {
    try {
        const result = await Widget.find({status:'active'})
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}

// @desc: get only modal widgets || @route: GET /api/professionals/get/modalWidgets  || @access:public
exports.modalWidgets = async (req, res) => {
    try {
        const result = await Widget.find({
            $and:[
                {status:'active'},
                {$or:[
                    {name:'text'},
                    {name:'video'},
                    {name:'section'}
                ]}
            ]
        })
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}

// @desc: get site Nav for nav bar || @route: GET /api/professionals/get/getUserNav  || @access:public
exports.getUserNav = async (req, res) => {
    const {_id} = req.user
    const {site} = req.body
    try {
        const result = await Nav.find(
            {
                $and:[
                    {site},
                    {user:_id},
                    {status:'enabled'}
                ]
            },
            "name order"
        ).sort("order")
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}

// @desc: get all site Nav for edit modal || @route: GET /api/professionals/get/getallNav  || @access:public
exports.getallNav = async (req, res) => {
    const {_id} = req.user
    const {site} = req.body
    try {
        const result = await Nav.find(
            {
                $and:[
                    {site},
                    {user:_id}
                ]
            },
            "name order"
        ).sort("order")
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}

// @desc: get a page body, all widgets in order arranged || @route: GET /api/professionals/get/getPageBody  || @access:public
exports.getPageBody = async (req, res) => {
    const {_id} = req.user
    const {site, screen} = req.body
    try {
        const result = await Sitebody.find(
            {
                $and:[
                    {site},
                    {screen},
                    {"show_on.page":true},
                    {status:'active'}
                ]
            }
        ).sort("order")
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        serverError(res, error)
    }
}
