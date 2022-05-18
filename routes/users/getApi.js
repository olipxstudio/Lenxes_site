const express = require("express");
const { getAllUsers } = require("../../controllers/users/getContollers");
const router = express.Router();

router.get("/allUsers", getAllUsers);

module.exports = router;
