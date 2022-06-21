const express = require("express");
const router = express.Router();

const {
    updateSitePolicy,
    completeSite,
    updateSite,
    updateSiteNav,
    lockUnlockSiteNav,
    updateCTA
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

// update site Nav @route: PATCH /api/professionals/patch/updateSiteNav
router.patch("/updateSiteNav", validateUserToken, updateSiteNav);

// lock or unloak site Nav @route: PATCH /api/professionals/patch/lockUnlockSiteNav
router.patch("/lockUnlockSiteNav", validateUserToken, lockUnlockSiteNav);

// update call to action in site nav @route: PATCH /api/professionals/patch/updateCTA
router.patch("/updateCTA", validateUserToken, updateCTA);




module.exports = router;
