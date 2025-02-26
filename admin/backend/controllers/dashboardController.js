const db = require("../db"); // Ensure database connection is set up

exports.getAvailableBuses = (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const query = `
    SELECT id, route_from, route_to, date, departure_time
    FROM buses 
    WHERE date >= ?
    ORDER BY date, departure_time;
  `;

  db.query(query, [today], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error fetching available buses." });
    }

    res.status(200).json(results);
  });
};
