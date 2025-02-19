const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminLoginDetails = {
  username: "admin",
  password: bcrypt.hashSync("admin123", 10), // Change as needed
};

exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (username === adminLoginDetails.username && bcrypt.compareSync(password, adminLoginDetails.password)) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.addBus = (req, res) => {
  let { time, departure_time, route_from, route_to, date } = req.body;

  if (!departure_time || !route_from || !route_to || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Auto-generate route
  const route = `${route_from}-${route_to}`;

  // Set default seats
  const total_seats = 50;
  const available_seats = 50;

  // Convert departure time to Date object and calculate arrival time (+10 hours)
  const depTime = new Date(`1970-01-01T${departure_time}`);
  depTime.setHours(depTime.getHours() + 10);
  const arrival_time = depTime.toTimeString().split(" ")[0]; // Format: HH:MM:SS

  // Set default journey time
  const journey_time = "10h";

  const sql = `INSERT INTO buses (route, time, departure_time, arrival_time, total_seats, available_seats, route_from, route_to, journey_time, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [route, time, departure_time, arrival_time, total_seats, available_seats, route_from, route_to, journey_time, date],
    (err, result) => {
      if (err) {
        console.error("Error adding bus:", err);
        return res.status(500).json({ message: "Failed to add bus" });
      }
      res.json({ message: "Bus added successfully", busId: result.insertId });
    }
  );
};


exports.deleteBooking = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM bookings WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).json({ message: "Failed to delete booking" });
    }
    res.json({ message: "Booking deleted successfully" });
  });
};
