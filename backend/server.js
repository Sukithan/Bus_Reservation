require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const busRoutes = require("./routes/busRoutes");
const bookingDetailsRoutes = require("./routes/bookingDetailsRoutes");
const UserDetailsRoutes = require("./routes/UserDetailsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", authRoutes);      // Authentication routes
app.use("/api/bookings", bookingRoutes); // Booking routes
app.use("/api/buses", busRoutes);       // Bus routes
app.use("/api", bookingDetailsRoutes); // Register the new booking details route
app.use("/api/user", UserDetailsRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the NCG Bus Booking API!");
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
