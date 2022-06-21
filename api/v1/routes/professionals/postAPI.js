const express = require("express");
const router = express.Router();

const {
    createSite,
    addWidget,
    addNav
} = require("../../controllers/professionals/postController");

const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
  checkIfIsUser,
  verifyEmail,
  uploadImage,
  checkImage,
  // getVideoThumbnail,
} = require("../../02_utils/middlewares");

const { validateUserToken } = require("../../02_utils/common");

// save or update social
router.post("/createSite", validateUserToken, createSite);

// to add new widget for display in modal to select
router.post("/widget", addWidget);

// to add new nav to site @route: POST /api/professionals/post/addNav
router.post("/addNav", validateUserToken, addNav);





module.exports = router;
