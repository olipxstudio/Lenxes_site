const express = require("express");
const router = express.Router();

const {
    updateSitePolicy,
    completeSite,
    updateSite
} = require("../../controllers/professionals/patchControllers");

const { validateUserToken } = require("../../02_utils/common");
const {
    uploadImage,
    checkImage,
    checkIfUsernameIsTaken,
    checkIfPasswordIsCorrect,
} = require("../../02_utils/middlewares");

// update site details
router.patch("/updateSite", validateUserToken, updateSite);

// enter site verifications
router.patch("/completeSite", validateUserToken, completeSite);

// update site policy
router.patch("/updateSitePolicy", validateUserToken, updateSitePolicy);




module.exports = router;
