const express = require("express");
const router = express.Router();

const {
  updateUserSecurity,
  uploadUserProfilePicture,
  updateUserPassword,
  updateTwofactorAuth,
  updateUserProfile,
  updateUserPhoneEmail,
  updateAddAddress,
  updateSingleAddress
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
  "/updateUserPassword",
  validateUserToken,
  checkIfPasswordIsCorrect,
  updateUserPassword
);

// reset password
router.patch("/resetPassword", validateUserToken, updateUserPassword);

// update two factor auth
router.patch("/updateTwofactorAuth", validateUserToken, updateTwofactorAuth);

// update user profile details
router.patch("/updateUserProfile", validateUserToken, updateUserProfile);

// update user phone and email
router.patch("/updateUserPhoneEmail", validateUserToken, updateUserPhoneEmail);

// manage account - add address
router.patch("/updateAddAddress", validateUserToken, updateAddAddress);

// manage account - update single address
router.patch("/updateSingleAddress", validateUserToken, updateSingleAddress);










module.exports = router;
