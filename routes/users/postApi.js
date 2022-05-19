const express = require("express");
const router = express.Router();

const { createNewUser } = require("../../controllers/users/postController");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
} = require("../../02_utils/middlewares");
const { createUsersTable } = require("../../schemas/users");

router.post(
  "/user/new",
  createUsersTable,
  validateUserEmail,
  checkIfUserAlreadyExist,
  createNewUser
);

module.exports = router;