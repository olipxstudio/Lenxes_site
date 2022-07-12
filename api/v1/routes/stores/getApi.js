const express = require("express");
const router = express.Router();

const {
  getAllStoreCategories,
  getAllStoreSub_Categories,
  getAllStoreSub_SetCategories,
  getProducts,
  getCatProducts,
  getNewArrivals,
  getStoreNotifications,
  getSearchProducts,
  getRandomProducts,
  getStoreDetails,
  getAllOrders,
  getPayouts,
  getSingleOrder,
  getStoreProducts
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

// get store notifications - 12 per time
router.get("/getStoreNotifications/:number", validateUserToken, getStoreNotifications);

// get store product search
router.get("/getSearchProducts", validateUserToken, getSearchProducts);

// get random products for store - suggested products - 12 per time
router.get("/getRandomProducts/:number", validateUserToken, getRandomProducts);

// get store details and structure
router.get("/getStoreDetails", validateUserToken, getStoreDetails);

// get all orders - pending or done - 15 per time
router.get("/getAllOrders/:status/:number", validateUserToken, getAllOrders);

// get all payouts, pending and done - 15 per time
router.get("/getPayouts/:number", validateUserToken, getPayouts);

// get single order details
router.get("/getSingleOrder", validateUserToken, getSingleOrder);

// get all store product by status - 15 per time
router.get("/getStoreProducts/:status/:number", validateUserToken, getStoreProducts);






module.exports = router;
