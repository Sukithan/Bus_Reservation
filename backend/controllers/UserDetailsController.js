const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch username and email from database
    const [rows] = await db.promise().query("SELECT username, email FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    // Send both username and email
    res.json({ username: rows[0].username, email: rows[0].email });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Update User Details
exports.updateUserDetails = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash password before updating
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Update username and password (if provided)
    const query = hashedPassword
      ? "UPDATE users SET username = ?, password = ? WHERE id = ?"
      : "UPDATE users SET username = ? WHERE id = ?";
    const values = hashedPassword ? [username, hashedPassword, decoded.id] : [username, decoded.id];

    await db.promise().query(query, values);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};
