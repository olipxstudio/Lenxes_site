const express = require("express");
const router = express.Router();

const { createNewUser } = require("../../controllers/users/postController");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
} = require("../../utils/middlewares");

router.post(
  "/user/new",
  validateUserEmail,
  checkIfUserAlreadyExist,
  createNewUser
);

module.exports = router;
