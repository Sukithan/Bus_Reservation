const db = require("../db");

// Fetch booked seats
exports.getBookedSeats = (req, res) => {
  const { busId } = req.params;

  const query = `SELECT JSON_UNQUOTE(JSON_EXTRACT(seat_number, '$[*]')) AS seat FROM bookings WHERE bus_id = ?;`;
  db.query(query, [busId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching booked seats." });
    }

    if (results.length === 0) {
      return res.status(200).json([]); // No booked seats
    }

    // Convert booked seat JSON array into a proper list
    const bookedSeats = results.flatMap(row => JSON.parse(row.seat));

    // Send back the seat numbers as an array
    res.status(200).json(bookedSeats);
  });
};


// Delete selected seats
exports.deleteSeats = (req, res) => {
  const { busId, selectedSeats } = req.body;
  if (!busId || !selectedSeats || selectedSeats.length === 0) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Step 1: Fetch all bookings for the given bus_id
  const fetchQuery = `SELECT id, seat_number FROM bookings WHERE bus_id = ?;`;
  db.query(fetchQuery, [busId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching booked seats." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No booked seats found." });
    }

    // Step 2: Process each booking row
    const updates = results.map((row) => {
      let bookedSeats = JSON.parse(row.seat_number); // Convert JSON to array
      let updatedSeats = bookedSeats.filter(seat => !selectedSeats.includes(seat)); // Remove selected seats

      if (updatedSeats.length === 0) {
        // If no seats left in this booking, delete the row
        return new Promise((resolve, reject) => {
          const deleteQuery = `DELETE FROM bookings WHERE id = ?;`;
          db.query(deleteQuery, [row.id], (deleteErr) => {
            if (deleteErr) reject(deleteErr);
            resolve();
          });
        });
      } else {
        // Otherwise, update the booking with the new seat list
        return new Promise((resolve, reject) => {
          const updateQuery = `UPDATE bookings SET seat_number = ? WHERE id = ?;`;
          db.query(updateQuery, [JSON.stringify(updatedSeats), row.id], (updateErr) => {
            if (updateErr) reject(updateErr);
            resolve();
          });
        });
      }
    });

    // Step 3: Execute all queries in parallel
    Promise.all(updates)
      .then(() => {
        res.status(200).json({ message: "Seats successfully deleted." });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error updating seat data." });
      });
  });
};



