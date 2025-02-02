const db = require("../db");

// Get seat count and booked seats for a specific bus
exports.getBusSeats = (req, res) => {
  const { busId } = req.params;

  if (!busId) {
    return res.status(400).json({ error: "Bus ID is required." });
  }

  const busQuery = `
    SELECT total_seats 
    FROM buses 
    WHERE id = ?
  `;
  db.query(busQuery, [busId], (err, busResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching bus details." });
    }

    if (busResults.length === 0) {
      return res.status(404).json({ error: "Bus not found." });
    }

    const totalSeats = busResults[0].total_seats;

    const bookingsQuery = `
      SELECT seat_number 
      FROM bookings 
      WHERE bus_id = ?
    `;
    db.query(bookingsQuery, [busId], (err, bookedSeats) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching booked seats." });
      }

      const bookedSeatNumbers = bookedSeats.map(seat => seat.seat_number);
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

// Book a seat for a user
exports.bookSeat = (req, res) => {
  const { busId, seatNumber, userId, booking_date, payment } = req.body;

  if (!busId || !seatNumber || !userId || !booking_date || !payment) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const checkQuery = `
    SELECT * 
    FROM bookings 
    WHERE bus_id = ? AND seat_number = ?
  `;

  db.query(checkQuery, [busId, seatNumber], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error checking seat availability." });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Seat already booked." });
    }

    const insertQuery = `
      INSERT INTO bookings (bus_id, seat_number, user_id, booking_date, payment) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [busId, seatNumber, userId, booking_date, payment], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error booking seat." });
      }
    
      res.status(200).json({ 
        message: "Seat successfully booked!",
        bookingId: result.insertId  // ✅ Fix: Now using result.insertId correctly
      });
    });
    
  });
};

// Get bus times for a specific route and date
exports.getBusTimes = (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  const query = `
    SELECT * 
    FROM buses 
    WHERE route_from = ? AND route_to = ? AND travel_date = ?
  `;

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
