const db = require("../db");

const getBusConfirmation = async (req, res) => {
  const { busId } = req.params;

  try {
    const query = "SELECT * FROM buses WHERE id = ?";
    db.query(query, [busId], (err, result) => {
      if (err) {
        console.error("Error fetching bus details:", err);
        return res.status(500).json({ error: "Failed to fetch bus details." });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Bus not found." });
      }

      res.json(result[0]); // Return the bus details
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getBusConfirmation };
