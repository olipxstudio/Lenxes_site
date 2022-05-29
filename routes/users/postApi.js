const express = require("express");
const router = express.Router();

const {
  createNewUser,
  loginUser,
  forgotPassword,
  AddNewPostPhoto,
  AddNewPostVideo,
  AddNewPost
} = require("../../controllers/users/postController");

const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
  checkIfIsUser,
  verifyEmail,
  uploadImage,
  checkImage,
} = require("../../02_utils/middlewares");

const { validateUserToken } = require("../../02_utils/common");
router.post(
  "/user/new",
  validateUserEmail,
  checkIfUserAlreadyExist,
  createNewUser
);

// route to uploade video
router.post("/uploadVideo", checkVideo, uploadVideo);
// login user
router.post("/login", checkIfIsUser, loginUser);

// reset password request
router.post("/forgotPassword", verifyEmail, forgotPassword);

router.post('/addPostPhoto', validateUserToken, checkImage, uploadImage, AddNewPostPhoto);
router.post('/addPostVideo', validateUserToken, AddNewPostVideo);
router.post('/addPost', validateUserToken, AddNewPost);

module.exports = router;
