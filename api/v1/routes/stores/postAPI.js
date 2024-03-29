const express = require("express");
const router = express.Router();

const {
  createStore,
  addCategory,
  addSubCategory,
  addSubSetCategory,
  addProduct,
  makeOrder,
  completeOrders
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

// Save an Order
router.post("/makeOrder", validateUserToken, makeOrder);

// validate token from seller and set payout
router.post("/completeOrders", validateUserToken, completeOrders);













module.exports = router;
