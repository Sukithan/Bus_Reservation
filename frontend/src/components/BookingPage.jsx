import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const BookingPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState(Array.from({ length: 50 }, (_, i) => ({ seatNumber: i + 1, status: "available" })));
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book a seat.");
      navigate("/login");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${busId}`);
        setSeats(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch seat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [busId]);

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return;
    setSelectedSeat(seat.seatNumber);
  };

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  const handleBooking = async () => {
    if (!selectedSeat || !selectedPayment || !userId) {
      alert("Please complete all selections.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/bookings/book-seat", {
        busId,
        seatNumber: selectedSeat,
        userId,
        booking_date: new Date().toISOString().split("T")[0],
        payment: selectedPayment,
      });
      alert("Seat successfully booked!");
      navigate(`/BookingDetails/${response.data.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to book the seat.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { label: "MasterCard", value: "MasterCard", img: "/assets/master.png" },
    { label: "VisaCard", value: "VisaCard", img: "/assets/visa.png" },
    { label: "Google Pay", value: "GooglePay", img: "/assets/gpay.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <h2 className="text-2xl font-bold mb-6">Book Your Seat</h2>
      {loading && <p>Loading seats...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Main Layout: Image on Left, Seats on Right */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        {/* Seat Allocation Reference Image (Left Side) */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img src="/assets/seat.jpg" alt="Seat Allocation Reference" className="w-64 md:w-80" />
        </div>

        {/* Seat Selection Grid (Right Side) */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-5 gap-4 mb-6">
            {seats.map((seat) => (
              <motion.div
                key={seat.seatNumber}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSeatClick(seat)}
                className={`p-4 text-center rounded cursor-pointer transition-all duration-200 ease-in-out shadow-md 
                  ${seat.status === "booked" ? "bg-red-500 text-white" : 
                  seat.seatNumber === selectedSeat ? "bg-green-500 text-white" : "bg-white border"}`}
              >
                {seat.seatNumber}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mt-6 mb-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Select Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((payment) => (
            <label
              key={payment.value}
              className={`flex items-center space-x-4 cursor-pointer p-3 rounded shadow-md w-64 border-2
                ${selectedPayment === payment.value ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
              onClick={() => handlePaymentChange(payment.value)}
            >
              <img src={payment.img} alt={payment.label} className="w-12 h-8" />
              <input
                type="radio"
                value={payment.value}
                checked={selectedPayment === payment.value}
                onChange={() => handlePaymentChange(payment.value)}
                className="hidden"
              />
              <span className="text-lg">{payment.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Booking Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBooking}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 shadow-md"
        disabled={loading}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </motion.button>
    </div>
  );
};

export default BookingPage;
