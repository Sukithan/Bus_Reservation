import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(formData);
      if (!response || !response.data || !response.data.token) {
        throw new Error("Invalid response from server.");
      }

      const { token } = response.data;
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white p-6 rounded-lg shadow-md flex w-[600px] overflow-hidden"
      >
        {/* Left Side (Login Form) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-1/2 flex flex-col items-center justify-center p-4"
        >
          {/* Animated Logo */}
          <motion.img
            src="/assets/log2.png"
            alt="Login Icon"
            className="w-16 h-16 mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Login</h1>

          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <motion.p
                className="text-red-500 text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 text-sm font-medium">
                User Name
              </label>
              <motion.input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                whileFocus={{ scale: 1.05 }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                whileFocus={{ scale: 1.05 }}
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </form>

          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </motion.div>

        {/* Right Side (Image) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-1/2 flex items-center justify-center bg-gray-100"
        >
          <motion.img
            src="/assets/login.png"
            alt="Login"
            className="w-full h-full object-cover"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
