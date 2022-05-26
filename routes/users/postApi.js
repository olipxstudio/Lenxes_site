const express = require("express");
const router = express.Router();

const { createNewUser } = require("../../controllers/users/postController");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
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

module.exports = router;
