const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getProfileDetails,
  getSuggestedToFollow,
  getRandomUsers,
  getPosts,
  getNiches,
  getSingleNiches,
  getSingleNichesMembers,
  getSingleNichesQuestions,
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
router.get("/niches/:skip", validateUserToken, getNiches);

// get single niches by id
router.get("/singleNiche", validateUserToken, getSingleNiches);

// get single niches members
router.get("/singleNicheMembers/:number", validateUserToken, getSingleNichesMembers);

// get single niches questions
router.get("/singleNicheQuestions/:number", validateUserToken, getSingleNichesQuestions);

module.exports = router;
