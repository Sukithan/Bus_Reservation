const express = require("express");
const { loginAdmin, addBus, deleteBooking } = require("../controllers/adminController");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/addbus", addBus);
router.delete("/deletebooking/:id", deleteBooking);

module.exports = router;
