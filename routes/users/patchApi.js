const express = require("express");
const router = express.Router();

const {
  updateUserSecurity,
} = require("../../controllers/users/patchControllers");
const { validateUserToken } = require("../../02_utils/common");

router.patch("/updateSecurity", validateUserToken, updateUserSecurity);

module.exports = router;
