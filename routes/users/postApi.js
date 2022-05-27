const express = require("express");
const router = express.Router();

const {
  createNewUser,
  loginUser,
  forgotPassword,
} = require("../../controllers/users/postController");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
  checkIfIsUser,
  verifyEmail,
} = require("../../02_utils/middlewares");

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
module.exports = router;
