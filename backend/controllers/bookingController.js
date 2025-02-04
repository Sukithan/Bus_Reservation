const db = require("../db"); // Assuming you have a db.js to handle MySQL connections

// Fetch available and booked seats
exports.getBusSeats = (req, res) => {
  const { busId } = req.params;

  if (!busId) {
    return res.status(400).json({ error: "Bus ID is required." });
  }

  const busQuery = `SELECT total_seats FROM buses WHERE id = ?;`;
  db.query(busQuery, [busId], (err, busResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching bus details." });
    }

    if (busResults.length === 0) {
      return res.status(404).json({ error: "Bus not found." });
    }

    const totalSeats = busResults[0].total_seats;

    // Fetch booked seats and parse JSON
    const bookingsQuery = `SELECT seat_number FROM bookings WHERE bus_id = ?;`;
    db.query(bookingsQuery, [busId], (err, bookedSeats) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching booked seats." });
      }

      const bookedSeatNumbers = bookedSeats.flatMap(seat => JSON.parse(seat.seat_number));
      const seats = [];

      for (let i = 1; i <= totalSeats; i++) {
        seats.push({
          seatNumber: i,
          status: bookedSeatNumbers.includes(i) ? "booked" : "available",
        });
      }

      res.status(200).json(seats);
    });
  });
};


// Book a seat
exports.bookSeat = (req, res) => {
  const { busId, selectedSeats, userId, booking_date, payment } = req.body;

  if (!busId || !selectedSeats || !userId || !booking_date || !payment) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Convert selectedSeats array to a string to store in DB
  const seatNumbersString = JSON.stringify(selectedSeats);
  const totalSeats = selectedSeats.length;
  const totalPrice = totalSeats * 2000; // Rs. 2000 per seat

  // Check if any of the selected seats are already booked
  const checkQuery = `SELECT * FROM bookings WHERE bus_id = ? AND JSON_CONTAINS(seat_number, ?)`;
  db.query(checkQuery, [busId, seatNumbersString], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error checking seat availability." });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Some seats are already booked." });
    }

    // Insert new booking record (as one row)
    const insertQuery = `INSERT INTO bookings (bus_id, seat_number, user_id, booking_date, payment, count, price) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertQuery, [busId, seatNumbersString, userId, booking_date, payment, totalSeats, totalPrice], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error booking seats." });
      }

      res.status(200).json({
        message: "Seats successfully booked!",
        bookingId: result.insertId,
        totalSeats,
        totalPrice,
      });
    });
  });
};


// Fetch bus times
exports.getBusTimes = (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  const query = `SELECT * FROM buses WHERE route_from = ? AND route_to = ? AND travel_date = ?;`;

  db.query(query, [from, to, date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching bus times." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No buses found for the selected route and date." });
    }

    res.status(200).json(results);
  });
};
