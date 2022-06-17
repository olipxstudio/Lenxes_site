const express = require("express");
const router = express.Router();

const {
    createStore,
    addCategory,
    addSubCategory,
    addSubSetCategory,
    uploadProduct,
    NewPoduct
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

// upload a product
router.post("/uploadProduct", validateUserToken, uploadProduct);




module.exports = router;
