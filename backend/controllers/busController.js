const db = require("../db"); // Ensure you have a database connection setup

exports.getBusTimes = (req, res) => {
  const { route_from, route_to, date } = req.query;

  if (!route_from || !route_to || !date) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  const query = `
    SELECT id, departure_time, arrival_time, journey_time, available_seats
    FROM buses 
    WHERE route_from = ? AND route_to = ? AND date = ?
  `;

  db.query(query, [route_from, route_to, date], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error fetching bus times." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No buses found for the selected route and date." });
    }

    res.status(200).json(results);
  });
};
