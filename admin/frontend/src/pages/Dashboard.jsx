import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


const Dashboard = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);

  // Fetch buses from the backend
  // useEffect(() => {
  //   fetch("http://localhost:5001/api/admin/buses")
  //     .then((res) => res.json())
  //     .then((data) => setBuses(data))
  //     .catch((err) => console.error("Error fetching buses:", err));
  // }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Ncg Admin Dashboard</h1>

        {/* Add Bus Button */}
        <motion.button
          onClick={() => navigate("/add-bus")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 mb-4"
        >
          ➕ Add Bus
        </motion.button>

        {/* Delete Seats Button */}
        <motion.button
          onClick={() => navigate("/delete-seats")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600"
        >
          ❌ Delete Booked Seats
        </motion.button>

        {/* Display Available Buses */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold">🚍 5+ Routes buses:</h2>
          <ul className="list-disc ml-6 text-gray-600">
          <p className="text-gray-500">WelCome admin</p>
            {/* {buses.length > 0 ? (
              buses.map((bus) => (
                <li key={bus.id} className="py-2">
                  {bus.route_from} ➝ {bus.route_to} ({bus.departure_time} - {bus.arrival_time})
                </li>
              ))
            ) : (
              
            )} */}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
