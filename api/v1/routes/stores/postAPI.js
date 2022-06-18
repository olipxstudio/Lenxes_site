const express = require("express");
const router = express.Router();

const {
  createStore,
  addCategory,
  addSubCategory,
  addSubSetCategory,
  NewPoduct,
  addProduct,
} = require("../../controllers/stores/postController");

const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
  checkIfIsUser,
  verifyEmail,
  uploadImage,
  checkImage,
  // getVideoThumbnail,
} = require("../../02_utils/middlewares");

const { validateUserToken } = require("../../02_utils/common");

// save or update social
router.post("/createStore", validateUserToken, createStore);

// add a store category
router.post("/addCategory", validateUserToken, addCategory);

// add a store subcategory
router.post("/addSubCategory", validateUserToken, addSubCategory);

// add a store subsetcategory
router.post("/addSubSetCategory", validateUserToken, addSubSetCategory);

// post a product
router.post("/product/new", validateUserToken, addProduct);

module.exports = router;
