const express = require("express");
const router = express.Router();

const { patchUser } = require("../../controllers/users/patchControllers");
const {
  validateUserEmail,
  checkIfUserAlreadyExist,
} = require("../../02_utils/middlewares");

router.patch(
  "/account_security",
  validateUserEmail,
  patchUser
);

module.exports = router;
