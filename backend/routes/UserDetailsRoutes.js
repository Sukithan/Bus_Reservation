const express = require("express");
const router = express.Router();
const UserDetailsController = require("../controllers/UserDetailsController");

// Get user details (Authenticated User)
router.get("/", UserDetailsController.getUserDetails);

// Update username and password
router.put("/update", UserDetailsController.updateUserDetails);

module.exports = router;
