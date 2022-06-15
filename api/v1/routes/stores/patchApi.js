const express = require("express");
const router = express.Router();

const {
  updateStorePolicy,
  completeStore,
  updateStore,
  updateCategory,
  updateSubCategory,
  updateSubSetCategory
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

// update a store category
router.patch("/updateCategory", validateUserToken, updateCategory);

// update a store subcategory
router.patch("/updateSubCategory", validateUserToken, updateSubCategory);

// update a store subsetcategory
router.patch("/updateSubSetCategory", validateUserToken, updateSubSetCategory);








module.exports = router;
