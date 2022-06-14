const express = require("express");
const router = express.Router();

const {
  updateUserSecurity,
  uploadUserProfilePicture,
  updateUserPassword,
} = require("../../controllers/users/patchControllers");

const { validateUserToken } = require("../../02_utils/common");
const {
  uploadImage,
  checkImage,
  checkIfUsernameIsTaken,
  checkIfPasswordIsCorrect,
} = require("../../02_utils/middlewares");

// reset password
router.patch("/resetPassword", validateUserToken, updateUserPassword);




module.exports = router;
