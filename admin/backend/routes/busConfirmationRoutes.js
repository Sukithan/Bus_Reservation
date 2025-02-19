const express = require("express");
const router = express.Router();
const { getBusConfirmation } = require("../controllers/busConfirmationController");

router.get("/bus-confirmation/:busId", getBusConfirmation);

module.exports = router;
