const db = require("../db");

// Fetch booked seats with usernames
exports.getBookedSeats = (req, res) => {
  const { busId } = req.params;

  const query = `
    SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(seat_number, '$[*]')) AS seat, 
      users.username 
    FROM bookings 
    JOIN users ON bookings.user_id = users.id
    WHERE bus_id = ?;
  `;

  db.query(query, [busId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching booked seats." });
    }

    if (results.length === 0) {
      return res.status(200).json([]); // No booked seats
    }

    // Convert booked seat JSON array into an array of objects
    const bookedSeats = results.flatMap(row => 
      JSON.parse(row.seat).map(seat => ({ seat_number: seat, username: row.username })))
      
    res.status(200).json(bookedSeats);
  });
};

// Delete selected seats
exports.deleteSeats = (req, res) => {
  const { busId, selectedSeats } = req.body;
  if (!busId || !selectedSeats || selectedSeats.length === 0) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const fetchQuery = `SELECT id, seat_number FROM bookings WHERE bus_id = ?;`;
  db.query(fetchQuery, [busId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching booked seats." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No booked seats found." });
    }

    const updates = results.map((row) => {
      let bookedSeats = JSON.parse(row.seat_number); 
      let updatedSeats = bookedSeats.filter(seat => !selectedSeats.includes(seat)); 

      if (updatedSeats.length === 0) {
        return new Promise((resolve, reject) => {
          const deleteQuery = `DELETE FROM bookings WHERE id = ?;`;
          db.query(deleteQuery, [row.id], (deleteErr) => {
            if (deleteErr) reject(deleteErr);
            resolve();
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          const updateQuery = `UPDATE bookings SET seat_number = ? WHERE id = ?;`;
          db.query(updateQuery, [JSON.stringify(updatedSeats), row.id], (updateErr) => {
            if (updateErr) reject(updateErr);
            resolve();
          });
        });
      }
    });

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
