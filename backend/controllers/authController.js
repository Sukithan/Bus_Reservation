const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

// Signup route
exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, hashedPassword, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating user." });
      }
      res.status(201).json({ message: "User created!", userId: results.insertId });
    }
  );
};

// Login route
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: "User not found." });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate JWT with user ID
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

      if (!token) {
        console.error("JWT Token generation failed.");
        return res.status(500).json({ message: "Token generation failed." });
      }
      
      console.log("Generated Token:", token);  // Debugging
      res.json({ token });
    }
  );
};
