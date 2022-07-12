const express = require("express");
const router = express.Router();

const {
    createSite,
    addWidget,
    addNav,
    addTeam,
    addTestimonials,
    addCoreValue,
    addConnect,
    addDownloadable,
    addLinks,
    addSkillSet,
    addVideo,
    addPastProjects,
    addPartners,
    addText,
    addSection,
    addServices,
    addStats,
    addHorizontalCard,
    addExperience,
    addBanner,
    addFaqs
} = require("../../controllers/professionals/postController");

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
router.post("/createSite", validateUserToken, createSite);

// to add new widget for display in modal to select
router.post("/addWidget", addWidget);

// to add new nav to site @route: POST /api/professionals/post/addNav
router.post("/addNav", validateUserToken, addNav);

// to Add Team to Site @route: POST /api/professionals/post/addTeam
router.post("/addTeam", validateUserToken, addTeam);

// to Add Testimonials to Site @route: POST /api/professionals/post/addTestimonials
router.post("/addTestimonials", validateUserToken, addTestimonials);

// to Add Core Value to Site @route: POST /api/professionals/post/addCoreValue
router.post("/addCoreValue", validateUserToken, addCoreValue);

// to Add Let's Connect to Site @route: POST /api/professionals/post/addConnect
router.post("/addConnect", validateUserToken, addConnect);

// to Add PDF Downloadable to Site @route: POST /api/professionals/post/addDownloadable
router.post("/addDownloadable", validateUserToken, addDownloadable);

// to Add Links to Site @route: POST /api/professionals/post/addLinks
router.post("/addLinks", validateUserToken, addLinks);

// to Add addSkillSet to Site @route: POST /api/professionals/post/addSkillSet
router.post("/addSkillSet", validateUserToken, addSkillSet);

// to Add Video to Site @route: POST /api/professionals/post/addVideo
router.post("/addVideo", validateUserToken, addVideo);

// to Add Past Projects to Site @route: POST /api/professionals/post/addPastProjects
router.post("/addPastProjects", validateUserToken, addPastProjects);

// to Add Partners to Site @route: POST /api/professionals/post/addPartners
router.post("/addPartners", validateUserToken, addPartners);

// to Add Text to Site @route: POST /api/professionals/post/addText
router.post("/addText", validateUserToken, addText);

// to Add Section to Site @route: POST /api/professionals/post/addSection
router.post("/addSection", validateUserToken, addSection);

// to Add Services to Site @route: POST /api/professionals/post/addServices
router.post("/addServices", validateUserToken, addServices);

// to Add Stats to Site @route: POST /api/professionals/post/addStats
router.post("/addStats", validateUserToken, addStats);

// to Add Horizontal Card to Site @route: POST /api/professionals/post/addHorizontalCard
router.post("/addHorizontalCard", validateUserToken, addHorizontalCard);

// to Add Experience to Site @route: POST /api/professionals/post/addExperience
router.post("/addExperience", validateUserToken, addExperience);

// to Add Banner to Site @route: POST /api/professionals/post/addBanner
router.post("/addBanner", validateUserToken, addBanner);

// to Add FAQs to Site @route: POST /api/professionals/post/addFaqs
router.post("/addFaqs", validateUserToken, addFaqs);





module.exports = router;
