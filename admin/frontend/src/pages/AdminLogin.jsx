import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/admin/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials 😓");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-center text-gray-700 mb-6"
        >
          🌟 Welcome Admin! 🚀
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-lg text-gray-600 mb-6"
        >
          Please login to access the Admin Dashboard ✨
        </motion.p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="border p-2 w-full rounded text-lg"
            type="text"
            placeholder="Admin Username 🧑‍💼"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border p-2 w-full rounded text-lg"
            type="password"
            placeholder="Password 🔑"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-200"
          >
            Login 🚪
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
