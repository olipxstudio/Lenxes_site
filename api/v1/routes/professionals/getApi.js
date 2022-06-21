const express = require("express");
const router = express.Router();

const {
  getallWidgets,
  getUserNav,
  modalWidgets,
  getallNav,
  getPageBody
} = require("../../controllers/professionals/getControllers");

const { validateUserToken } = require("../../02_utils/common");

// get all enabled site widgets || @route: GET /api/professionals/get/getallWidgets
router.get("/getallWidgets", getallWidgets);

// get all user enabled nav for nav bar || @route: GET /api/professionals/get/getUserNav
router.get("/getUserNav", validateUserToken, getUserNav);

// get all site nav for edit modal || @route: GET /api/professionals/get/modalWidgets
router.get("/getallNav", validateUserToken, getallNav);

// get only modal widgets || @route: GET /api/professionals/get/modalWidgets
router.get("/modalWidgets", validateUserToken, modalWidgets);

// get a page body, all widgets in order arranged || @route: GET /api/professionals/get/getPageBody
router.get("/getPageBody", validateUserToken, getPageBody);





module.exports = router;
