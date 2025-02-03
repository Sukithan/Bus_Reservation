import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const HomePage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const searchBuses = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const response = await axios.get("http://localhost:5000/api/buses", {
        params: { route_from: from, route_to: to, date: formattedDate },
      });
      if (response.data.length === 0) {
        setError("No buses available for the selected route and date.");
      } else {
        setBuses(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Fetching error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bookSeat = (busId) => {
    navigate(`/booking/${busId}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/assets/ncg.jpg)" }}
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-bold mb-4 text-white shadow-lg bg-blue-600 px-4 py-2 rounded-lg"
      >
        NCG Express
      </motion.h2>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">Search Buses</h1>
        <form onSubmit={searchBuses} className="flex flex-col space-y-4">
          <select value={from} onChange={(e) => setFrom(e.target.value)} required className="p-2 border rounded w-full">
            <option value="" disabled>Select From</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Colombo">Colombo</option>
            <option value="Ampara">Ampara</option>
            <option value="Kandy">Kandy</option>
            <option value="Nuwaraeliya">Nuwaraeliya</option>
          </select>
          <select value={to} onChange={(e) => setTo(e.target.value)} required className="p-2 border rounded w-full">
            <option value="" disabled>Select To</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Colombo">Colombo</option>
            <option value="Ampara">Ampara</option>
            <option value="Kandy">Kandy</option>
            <option value="Nuwaraeliya">Nuwaraeliya</option>
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-2 border rounded w-full" />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search Buses
          </motion.button>
        </form>
        {loading && <p className="text-center mt-4 text-gray-600">Loading buses...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </motion.div>

      {!loading && buses.length > 0 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 space-y-8">
    {buses.map((bus) => (
      <motion.div 
        key={bus.id} 
        whileHover={{ scale: 1.02 }}
        className="p-5 bg-white shadow-md rounded-md w-full max-w-lg flex items-center space-x-4"
      >
        {/* Bus Image on the Left */}
        <img 
          src="/assets/sample.jpeg" 
          alt="Bus Image" 
          className="w-40 h-28 object-cover rounded-md"
        />

        {/* Bus Details on the Right */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">Bus ID: {bus.id}</h2>
          <p className="text-gray-900">Departure: {bus.departure_time}</p>
          <p className="text-gray-900">Arrival: {bus.arrival_time}</p>
          <p className="text-gray-900">Journey Time: {bus.journey_time}</p>
          <p className="text-gray-900">Seats Available: {bus.available_seats}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => bookSeat(bus.id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2 w-full"
          >
            Book Seat
          </motion.button>
        </div>
      </motion.div>
    ))}
  </motion.div>
)}

    </div>
  );
};

export default HomePage;
