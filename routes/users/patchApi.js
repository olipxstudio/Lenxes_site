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

// update user security data
router.patch(
  "/updateSecurity",
  validateUserToken,
  checkIfUsernameIsTaken,
  updateUserSecurity
);

// upload user profile picture
router.patch(
  "/uploadProfilePicture",
  validateUserToken,
  checkImage,
  uploadImage,
  uploadUserProfilePicture
);

// change password
router.patch(
  "/changePassword",
  validateUserToken,
  checkIfPasswordIsCorrect,
  updateUserPassword
);

// reset password
router.patch("/resetPassword", validateUserToken, updateUserPassword);

module.exports = router;
