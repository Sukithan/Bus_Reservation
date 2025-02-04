const { getBusTimes, getBusSeats, bookSeat } = require("../controllers/bookingController");

const router = require("express").Router();

// Define routes
router.get("/bus-times", getBusTimes);       // Fetch bus times
router.get("/:busId", getBusSeats);    // Fetch seat details
router.post("/book-seat", bookSeat);         // Book a seat

module.exports = router;
