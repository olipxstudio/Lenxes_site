const express = require("express");
const router = express.Router();

const { getAllUsers, getSuggestedFollowers } = require("../../controllers/users/getContollers");
const { validateUserToken } = require("../../02_utils/common");

router.get("/allUsers", getAllUsers);

router.get("/suggestedToFollow", validateUserToken, getSuggestedFollowers);

module.exports = router;
