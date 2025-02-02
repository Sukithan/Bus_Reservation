const express = require("express");
const router = express.Router();
const bookingDetailsController = require("../controllers/bookingDetailsController");

router.get("/BookingDetails/:bookingId", bookingDetailsController.getBookingDetails);

module.exports = router;
