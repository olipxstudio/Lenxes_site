const express = require("express");
const router = express.Router();

const {
  getAllStoreCategories,
  getAllStoreSub_Categories,
  getAllStoreSub_SetCategories,
  getProducts,
} = require("../../controllers/stores/getControllers");
const { validateUserToken } = require("../../02_utils/common");

// get all store categories
router.get("/getAllStoreCategories", validateUserToken, getAllStoreCategories);

// get all store sub categories
router.get(
  "/getAllStoreSub_Categories",
  validateUserToken,
  getAllStoreSub_Categories
);

// get all store sub categories
router.get(
  "/getAllStoreSub_SetCategories",
  validateUserToken,
  getAllStoreSub_SetCategories
);

// get a store products
router.get("/store/products", validateUserToken, getProducts);

module.exports = router;
