import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/available-buses")
      .then((res) => setBuses(res.data))
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-3xl"
      >
        <h1 className="text-4xl font-bold mb-6 text-gray-800">🚍 NCG Admin Dashboard</h1>
        
        {/* Buttons Section */}
        <div className="flex space-x-4 mb-6">
          <motion.button
            onClick={() => navigate("/add-bus")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            ➕ Add Bus
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/delete-seats")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            ❌ Delete Booked Seats
          </motion.button>
        </div>

        {/* Available Buses List */}
        <div className="mt-6 text-left w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🚍 Available Buses:</h2>
          <div className="space-y-4">
            {buses.length > 0 ? (
              buses.map((bus, index) => (
                <motion.div 
                  key={bus.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg shadow-lg flex justify-between items-center transition ${index % 2 === 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}
                >
                  <div>
                    <p className="text-lg font-bold">{bus.route_from} ➝ {bus.route_to}</p>
                    <p className="text-gray-700">🗓 Date: {new Date(bus.date).toISOString().split("T")[0]}</p>
                    <p className="text-gray-700">⏰ Departure: {bus.departure_time}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/seatdelete/${bus.id}`)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                  >
                    Delete Seats
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No available buses.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
