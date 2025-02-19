import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const BusConfirmation = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/bus-confirmation/${busId}`);
        setBusDetails(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bus details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  if (loading) return <p className="text-gray-500 text-lg animate-pulse">Loading bus details...</p>;
  if (error) return <p className="text-red-500 font-semibold">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-300 p-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4"
      >
        Bus Confirmation
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center bg-white shadow-md p-6 rounded-lg w-full max-w-2xl">
        <motion.img 
          src="/assets/ncg.jpg" 
          alt="Bus Image" 
          className="w-full md:w-1/2 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-4"
        >
          <p className="text-lg font-semibold">Bus Details</p>
          <p className="text-gray-600">Your bus details are below:</p>
          
          <div className="mt-4 space-y-2">
            <p><strong>Route From:</strong> {busDetails.route_from}</p>
            <p><strong>Route To:</strong> {busDetails.route_to}</p>
            <p><strong>Date:</strong> {busDetails.date}</p>
            <p><strong>Time:</strong> {busDetails.time}</p>
            <p><strong>Departure Time:</strong> {busDetails.departure_time}</p>
            <p><strong>Arrival Time:</strong> {busDetails.arrival_time}</p>
            <p><strong>Journey Time:</strong> {busDetails.journey_time}</p>
            <p><strong>Total Seats:</strong> {busDetails.total_seats}</p>
            <p><strong>Available Seats:</strong> {busDetails.available_seats}</p>
          </div>

          <motion.p 
            className="mt-4 text-green-600 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Bus added successfully!
          </motion.p>

          <button 
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BusConfirmation;
