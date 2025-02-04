const db = require("../db");

// Get Booking Details for a User
exports.getBookingDetails = (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required." });
  }

  const query = `
    SELECT 
      u.username, u.email, 
      b.id AS booking_id, b.booking_date, b.seat_number, b.payment,b.price,
      bus.route_from, bus.route_to, bus.time, bus.departure_time, bus.arrival_time, bus.journey_time
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN buses bus ON b.bus_id = bus.id
    WHERE b.id = ?;
  `;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching booking details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).json(results[0]);
  });
};
