const express = require("express");
const router = express.Router();

const {
  getAllStoreCategories,
  getAllStoreSub_Categories,
  getAllStoreSub_SetCategories,
  getProducts,
  getCatProducts,
  getNewArrivals
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

// get products from category, sub and set - 12 per time
router.get("/getCatProducts/:path/:number", validateUserToken, getCatProducts);

// get store new arrivals products - 6 per time
router.get("/getNewArrivals/:number", validateUserToken, getNewArrivals);






module.exports = router;
