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
  getProductToTagged,
  getSingleProduct,
  getRandomProducts,
  getCartCollections,
  getFeedUserPreview,
  getSitePreview,
  getSuggestedPeople,
  getExploreUserSearch,
  getExploreProductSearch,
  getExploreProducts,
  getCartQualifiedProducts,
  getCartNotQualified,
  getProductReviews,
  getAllOrders
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

// get products to be tagged by search
router.get("/getProductToTagged", validateUserToken, getProductToTagged);

// get single product details
router.get("/getSingleProduct", validateUserToken, getSingleProduct);

// get random products for single product page - 6 per time
router.get("/getRandomProducts/:number", validateUserToken, getRandomProducts);

// get all user cart collections
router.get("/getCartCollections", validateUserToken, getCartCollections);

// get all product in a cart collection that are qualified for payment
router.get("/getCartQualifiedProducts", validateUserToken, getCartQualifiedProducts);

// get all product in a cart collection that not qualified
router.get("/getCartNotQualified", validateUserToken, getCartNotQualified);

// Get user details and four most recent posts - for previewing user to follow details on empty feed
router.get("/getFeedUserPreview", validateUserToken, getFeedUserPreview);

// Get user Site brand name and Hero - for previewing user business on post
router.get("/getSitePreview", validateUserToken, getSitePreview);

// Get suggested people base on user Industry - for explore page - 7 per time
router.get("/getSuggestedPeople/:number", validateUserToken, getSuggestedPeople);

// Get explore User Search - for explore page
router.get("/getExploreUserSearch", validateUserToken, getExploreUserSearch);

// Get explore Product Search - for explore page
router.get("/getExploreProductSearch", validateUserToken, getExploreProductSearch);

// Get explore Products - 12 per time
router.get("/getExploreProducts", validateUserToken, getExploreProducts);

// Get Product reviews - 12 per time
router.get("/getProductReviews/:number", validateUserToken, getProductReviews);

// Get all orders - pending or done - 15 per time
router.get("/getAllOrders/:status/:number", validateUserToken, getAllOrders);




module.exports = router;
