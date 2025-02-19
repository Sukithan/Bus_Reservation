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
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">🔑 Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="border p-2 w-full rounded" type="text" placeholder="Admin Name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="border p-2 w-full rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <motion.button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">Login</motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
