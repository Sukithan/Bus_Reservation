const express = require("express");
const { getBookedSeats, deleteSeats } = require("../controllers/seatdeleteController");
const router = express.Router();

router.get("/:busId", getBookedSeats); // Fetch booked seats with usernames
router.post("/seat", deleteSeats); // Delete selected seats

module.exports = router;
