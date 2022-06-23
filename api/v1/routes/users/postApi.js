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
  Saved,
  NewNiche,
  AddMembertoNiche,
  followUnfollowNiche,
  nicheQuestion,
  likeUnlikeNicheQuestion,
  createDiscuss,
  addDiscussMember,
  removeDiscussMember,
  addDicsussChat,
  sendDiscussNotification,
  followOrUnfollow,
  saveComment,
  shareItem,
  saveSocial,
  sendPdf
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
  checkPdf,
  uploadPdf,
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

// upload photo - saveto would either save to social folders, store folders or professionals folders
router.post(
  "/uploadPhoto/:saveto",
  validateUserToken,
  checkImage,
  uploadImage,
  sendPhoto
);

// upload photo - saveto would either save to social folders, store folders or professionals folders
router.post(
    "/uploadPdf/:saveto",
    validateUserToken,
    checkPdf,
    uploadPdf,
    sendPdf
);

// upload video - saveto would either save to social folders, store folders or professionals folders
router.post(
  "/uploadVideo/:saveto",
  validateUserToken,
  checkVideo,
  uploadVideo,
  getVideoThumbnail,
  sendVideo
);

// create new post
router.post("/new-post", validateUserToken, createPost);

// save likes for posts and products
router.post("/like", validateUserToken, RegisterLikes);

// save post to user saved
router.post("/saved", validateUserToken, Saved);

// create new niche
router.post("/createNiche", validateUserToken, NewNiche);

// add memeber to niche
router.post(
  "/addNicheMember",
  validateUserToken,
  AddMembertoNiche
);

// follow and unfollow a niche
router.post("/followUnfollowNiche", validateUserToken, followUnfollowNiche);

// ask niche question
router.post("/nicheQuestion", validateUserToken, nicheQuestion);

// like and unlike niche question
router.post(
  "/likeUnlikeNicheQuestion",
  validateUserToken,
  likeUnlikeNicheQuestion
);

// Create a Discuss
router.post("/createDiscuss", validateUserToken, createDiscuss);

// add member to a Discuss
router.post("/addDiscussMember", validateUserToken, addDiscussMember);

// remove  member from a Discuss
router.post("/removeDiscussMember", validateUserToken, removeDiscussMember);

// post to a Discuss chat
router.post(
  "/addDicsussChat",
  validateUserToken,
  addDicsussChat,
  sendDiscussNotification
);

// follow and unfollow an account
router.post(
  "/followOrUnfollow",
  validateUserToken,
  followOrUnfollow
);

// create a comment
router.post("/saveComment", validateUserToken, saveComment);

// Share to other account
router.post("/shareItem", validateUserToken, shareItem);

// save or update social
router.post("/saveSocial", validateUserToken, saveSocial);

module.exports = router;
