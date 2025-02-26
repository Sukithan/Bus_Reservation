const express = require("express");
const { getAvailableBuses } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/available-buses", getAvailableBuses);

module.exports = router;
