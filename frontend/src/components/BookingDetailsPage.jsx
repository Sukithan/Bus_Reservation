import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/BookingDetails/${bookingId}`);
        setBookingDetails(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) return <p className="text-gray-500 text-lg animate-pulse"> Loading booking details...</p>;
  if (error) return <p className="text-red-500 font-semibold"> {error} </p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-300 p-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4"
      >
        Booking Confirmation
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center bg-white shadow-md p-6 rounded-lg w-full max-w-2xl">
        <motion.img 
          src="/assets/sucess.png" 
          alt="Success" 
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
          <p className="text-lg font-semibold">Thank you for booking, {bookingDetails.username}!</p>
          <p className="text-gray-600">Your booking details are below:</p>
          
          <div className="mt-4 space-y-2">
            <p><strong>Seat Number:</strong> {bookingDetails.seat_number}</p>
            <p><strong>From:</strong> {bookingDetails.route_from}</p>
            <p><strong>To:</strong> {bookingDetails.route_to}</p>
            <p><strong>Departure Time:</strong> {bookingDetails.departure_time}</p>
            <p><strong>Arrival Time:</strong> {bookingDetails.arrival_time}</p>
            <p><strong>Journey Time:</strong> {bookingDetails.journey_time}</p>
            <p><strong>Payment Method:</strong> {bookingDetails.payment}</p>
            <p><strong>Booking Date:</strong> {bookingDetails.booking_date}</p>
          </div>

          <motion.p 
            className="mt-4 text-green-600 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Your booking has been successfully confirmed!
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
