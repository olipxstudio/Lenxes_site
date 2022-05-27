const express = require("express");
const router = express.Router();

const {
  updateUserSecurity,
  uploadUserProfilePicture,
} = require("../../controllers/users/patchControllers");
const { validateUserToken } = require("../../02_utils/common");
const {
  uploadImage,
  checkImage,
  checkIfUsernameIsTaken,
} = require("../../02_utils/middlewares");

router.patch(
  "/updateSecurity",
  validateUserToken,
  checkIfUsernameIsTaken,
  updateUserSecurity
);
router.patch(
  "/uploadProfilePicture",
  validateUserToken,
  checkImage,
  uploadImage,
  uploadUserProfilePicture
);

module.exports = router;
