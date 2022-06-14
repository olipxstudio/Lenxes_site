const express = require("express");
const router = express.Router();

const {
    createStore,
} = require("../../controllers/stores/postController");

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
router.post("/createStore", validateUserToken, createStore);








module.exports = router;
