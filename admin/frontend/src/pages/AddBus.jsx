import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBus = () => {
  const navigate = useNavigate();
  const cities = ["Jaffna", "Colombo", "Ampara", "Kandy", "Nuwaraeliya"];
  
  const [formData, setFormData] = useState({
    route_from: "",
    route_to: "",
    departure_time: "",
    arrival_time: "",
    total_seats: "50",
    available_seats: "50",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "departure_time") {
      const depTime = new Date(`1970-01-01T${value}:00`);
      depTime.setHours(depTime.getHours() + 10);
      newFormData.arrival_time = depTime.toTimeString().slice(0, 5);
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/admin/addbus", formData);
      if (response.data && response.data.busId) {
        alert("Bus added successfully!");
        navigate(`/bus-confirmation/${response.data.busId}`);
      } else {
        throw new Error("Bus ID not found in response");
      }
    } catch (error) {
      console.error("Error adding bus:", error);
      alert("Error adding bus. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 shadow-xl rounded-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-4">🚌 Add New Bus</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-gray-600">From:</label>
            <select
              name="route_from"
              value={formData.route_from}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>Select Departure City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-600">To:</label>
            <select
              name="route_to"
              value={formData.route_to}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>Select Destination City</option>
              {cities.filter(city => city !== formData.route_from).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-600">Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="p-2 border rounded w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-gray-600">Departure Time:</label>
            <input type="time" name="departure_time" value={formData.departure_time} onChange={handleChange} required className="p-2 border rounded w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-gray-600">Arrival Time:</label>
            <input type="text" name="arrival_time" value={formData.arrival_time} disabled className="p-2 border rounded w-full bg-gray-200" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full shadow-lg"
          >
            ➕ Add Bus
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBus;
