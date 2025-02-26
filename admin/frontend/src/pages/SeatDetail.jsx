import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const SeatDetail = () => {
  const [deletedSeats, setDeletedSeats] = useState([]);

  useEffect(() => {
    const fetchDeletedSeats = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/seat-detail");
        setDeletedSeats(response.data);
      } catch (error) {
        console.error("Error fetching deleted seat details:", error);
      }
    };

    fetchDeletedSeats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-indigo-400 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Deleted Seat Details</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Deleted Seats</th>
                <th className="py-2 px-4 border">Route</th>
                <th className="py-2 px-4 border">Time</th>
                <th className="py-2 px-4 border">Deleted At</th>
              </tr>
            </thead>
            <tbody>
              {deletedSeats.map((seat, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 border">{seat.username}</td>
                  <td className="py-2 px-4 border">{seat.email}</td>
                  <td className="py-2 px-4 border">{seat.deleted_seat_number}</td>
                  <td className="py-2 px-4 border">{seat.route} ({seat.route_from} → {seat.route_to})</td>
                  <td className="py-2 px-4 border">{seat.time}</td>
                  <td className="py-2 px-4 border">{new Date(seat.deleted_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SeatDetail;
