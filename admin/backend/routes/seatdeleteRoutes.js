// seatdeleteRoutes.js
const express = require("express");
const { getBookedSeats, deleteSeats } = require("../controllers/seatdeleteController");
const router = express.Router();

router.get("/:busId", getBookedSeats); // Fetch booked seats
router.post("/seat", deleteSeats); // Delete selected seats

module.exports = router;