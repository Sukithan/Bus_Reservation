const express = require("express");
const router = express.Router();
const seatDetailController = require("../controllers/seatDetailController");

// Route to get deleted seat details
router.get("/seat-detail", seatDetailController.getDeletedSeats);

module.exports = router;
