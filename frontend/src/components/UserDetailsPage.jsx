import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserDetailsPage = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token);  
  
        if (!token) {
          console.error("No token found, redirecting...");
          alert("Please Login your account");
          navigate("/auth/login");  
          return;
        }
  
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("User Data:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/auth/login");
      }
    };
  
    fetchUser();
  }, [navigate]);
  
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }

      await axios.put(
        "http://localhost:5000/api/user/update",
        { username: newUsername || user.username, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ ...prev, username: newUsername || prev.username }));
      setEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-xl flex w-full max-w-2xl overflow-hidden"
      >
        <div className="w-1/2 flex items-center justify-center bg-gray-100">
          <img src="/assets/detail.png" alt="User Details" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2 p-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">User Details</h2>
          <div className="text-lg text-gray-700">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdate}
                className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition-all"
              >
                Save Changes
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white w-full py-2 rounded mt-4 hover:bg-yellow-600 transition-all"
            >
              Edit Profile
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 text-white w-full py-2 rounded mt-4 hover:bg-red-600 transition-all"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsPage;
