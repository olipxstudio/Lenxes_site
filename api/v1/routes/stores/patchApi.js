const express = require("express");
const router = express.Router();

const {
  updateStorePolicy,
  completeStore,
  updateStore
} = require("../../controllers/stores/patchControllers");

const { validateUserToken } = require("../../02_utils/common");
const {
  uploadImage,
  checkImage,
  checkIfUsernameIsTaken,
  checkIfPasswordIsCorrect,
} = require("../../02_utils/middlewares");

// reset password
router.patch("/updateStorePolicy", validateUserToken, updateStorePolicy);

// reset password
router.patch("/completeStore", validateUserToken, completeStore);

// reset password
router.patch("/updateStore", validateUserToken, updateStore);








module.exports = router;
