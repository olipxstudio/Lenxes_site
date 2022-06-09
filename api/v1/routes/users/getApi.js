const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getProfileDetails,
  getSuggestedToFollow,
  getRandomUsers,
  getPosts,
  getNiches,
} = require("../../controllers/users/getContollers");
const { validateUserToken } = require("../../02_utils/common");

router.get("/allUsers", getAllUsers);

// Get suggested users to follow
router.get(
  "/suggestedToFollow",
  validateUserToken,
  getSuggestedToFollow,
  getRandomUsers
);

// Get user profile details
router.get("/userProfileDetails", validateUserToken, getProfileDetails);

// get post
router.get("/posts", validateUserToken, getPosts);

// get niches
router.get("/niches/:number", validateUserToken, getNiches);

module.exports = router;
