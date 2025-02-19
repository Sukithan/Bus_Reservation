const express = require("express");
const router = express.Router();
const adminbusController = require("../controllers/adminbusController");

// Define route for fetching bus times
router.get("/",adminbusController.getBusTimes);

module.exports = router;
