const express = require("express");
const router = express.Router();

const {
  createNewUser,
  loginUser,
  forgotPassword,
  sendPhoto,
  sendVideo,
  createPost,
  RegisterLikes,
  Notifications,
  Saved,
  NewNiche,
  AddMembertoNiche,
  followUnfollowNiche,
  nicheQuestion,
  likeUnlikeNicheQuestion
} = require("../../controllers/users/postController");

const {
  validateUserEmail,
  checkIfUserAlreadyExist,
  checkVideo,
  uploadVideo,
  checkIfIsUser,
  verifyEmail,
  uploadImage,
  checkImage,
  getVideoThumbnail,
} = require("../../02_utils/middlewares");

const { validateUserToken } = require("../../02_utils/common");
router.post(
  "/user/new",
  validateUserEmail,
  checkIfUserAlreadyExist,
  createNewUser
);

// login user
router.post("/login", checkIfIsUser, loginUser);

// reset password request
router.post("/forgotPassword", verifyEmail, forgotPassword);

// upload photo
router.post(
  "/uploadPhoto",
  validateUserToken,
  checkImage,
  uploadImage,
  sendPhoto
);
// upload video
router.post(
  "/uploadVideo",
  validateUserToken,
  checkVideo,
  uploadVideo,
  getVideoThumbnail,
  sendVideo
);

// create new post
router.post("/new-post", validateUserToken, createPost);

// save likes for posts and products
router.post("/like", validateUserToken, RegisterLikes, Notifications)

// save post to user saved
router.post("/saved", validateUserToken, Saved)

// create new niche
router.post("/createNiche", validateUserToken, NewNiche)

// add memeber to niche
router.post("/addNicheMember", validateUserToken, AddMembertoNiche, Notifications)

// follow and unfollow a niche
router.post("/followUnfollowNiche", validateUserToken, followUnfollowNiche)

// ask niche question
router.post("/nicheQuestion", validateUserToken, nicheQuestion)

// like and unlike niche question
router.post("/likeUnlikeNicheQuestion", validateUserToken, likeUnlikeNicheQuestion, Notifications)


module.exports = router;
