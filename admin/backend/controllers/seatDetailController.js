const db = require("../db");

// Helper function to execute SQL queries as promises
const queryPromise = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Fetch Deleted Seat Details
exports.getDeletedSeats = async (req, res) => {
  const query = `
    SELECT ds.deleted_seat_number, ds.deleted_time, 
           u.username, u.email,
           b.route, b.time, b.departure_time, b.arrival_time, 
           b.route_from, b.route_to, b.journey_time
    FROM deleted_seats ds
    JOIN users u ON ds.user_id = u.id
    JOIN buses b ON ds.bus_id = b.id
    ORDER BY ds.deleted_time DESC;
  `;
  
  try {
    const results = await queryPromise(query, []);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching deleted seat details:", err);
    res.status(500).json({ error: "Error retrieving deleted seat details." });
  }
};

// Insert Deleted Seat Details (Call this when seats are deleted)
exports.logDeletedSeats = async (userId, busId, deletedSeats) => {
  if (!userId || !busId || !Array.isArray(deletedSeats) || deletedSeats.length === 0) {
    console.error("Invalid input for logging deleted seats.");
    return;
  }

  const query = `
    INSERT INTO deleted_seats (user_id, bus_id, deleted_seat_number, deleted_time)
    VALUES (?, ?, ?, NOW());
  `;

  try {
    const insertPromises = deletedSeats.map((seat) =>
      queryPromise(query, [userId, busId, seat])
    );
    await Promise.all(insertPromises);
    console.log("Deleted seats logged successfully.");
  } catch (err) {
    console.error("Error logging deleted seat:", err);
  }
};
