const express = require("express");
const router = express.Router();

const {
  getAllUsers,
} = require("../../controllers/users/getContollers");
const { validateUserToken } = require("../../02_utils/common");

router.get("/allUsers", getAllUsers);





module.exports = router;
