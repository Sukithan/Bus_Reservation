const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

// Define route for fetching bus times
router.get("/", busController.getBusTimes);

module.exports = router;
