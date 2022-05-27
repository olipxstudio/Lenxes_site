const express = require("express");
const router = express.Router();

const {
  createNewUser,
  loginUser,
} = require("../../controllers/users/postController");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
  checkIfIsUser,
} = require("../../02_utils/middlewares");
const { createUsersTable } = require("../../schemas/users");

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

module.exports = router;
