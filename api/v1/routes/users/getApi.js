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
  getDiscussDetails,
  getDiscussChats,
  getFollowers,
  getFollowings,
  getSinglePost,
  getPostComments,
  getPostwithLinkedWord,
  getShared,
  getSaved,
  getNotifications,
  getExplore,
  getProductDetails,
  getTaggedProducts,
  getDiscussions,
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
router.get(
  "/singleNicheMembers/:number",
  validateUserToken,
  getSingleNichesMembers
);

// get single niches questions
router.get(
  "/singleNicheQuestions/:number",
  validateUserToken,
  getSingleNichesQuestions
);

// get Discuss details
router.get("/getDiscussDetails", validateUserToken, getDiscussDetails);

// get Discuss Chats
router.get("/getDiscussChats", validateUserToken, getDiscussChats);

// get all my followers
router.get("/getFollowers/:number", validateUserToken, getFollowers);

// get all my following
router.get("/getFollowings/:number", validateUserToken, getFollowings);

// get single post data
router.get("/getSinglePost", validateUserToken, getSinglePost);

// get single post comments
router.get("/getPostComments", validateUserToken, getPostComments);

// get single post with linked word
router.get(
  "/getPostwithLinkedWord/:number",
  validateUserToken,
  getPostwithLinkedWord
);

// get all items shared to me
router.get("/getShared/:number", validateUserToken, getShared);

// get all user saved post
router.get("/getSaved/:number", validateUserToken, getSaved);

// get all user notifications
router.get("/getNotifications/:number", validateUserToken, getNotifications);

// get explore posts
router.get("/getExplore/:number", validateUserToken, getExplore);

// get product details
router.get("/getProductDetails/:id", validateUserToken, getProductDetails);

// get tagged products for a post
router.get("/getTaggedProducts/:id", validateUserToken, getTaggedProducts);

// get discussions which user is part of
router.get("/getDiscussions", validateUserToken, getDiscussions);

module.exports = router;
