import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BookingPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book a seat.");
      navigate("/auth/login");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      navigate("/auth/login");
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
    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
    } else if (selectedSeats.length < 3) {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0 || !selectedPayment || !userId) {
      alert("Please select seats and payment method.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/bookings/book-seat", {
        busId,
        selectedSeats,
        userId,
        booking_date: new Date().toISOString().split("T")[0],
        payment: selectedPayment,
      });

      alert(`Seats booked! Total: Rs.${selectedSeats.length * 2000}`);
      navigate(`/BookingDetails/${response.data.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to book seats.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { label: "MasterCard", value: "MasterCard", img: "/assets/master.png" },
    { label: "VisaCard", value: "VisaCard", img: "/assets/visa.png" },
    { label: "Google Pay", value: "GooglePay", img: "/assets/gpay.png" },
  ];

  // Organizing seats into a bus-like structure
  const seatLayout = [
    [1, 2, null, 3, 4],
    [5, 6, null, 7, 8],
    [9, 10, null, 11, 12],
    [13, 14, null, 15, 16],
    [17, 18, null, 19, 20],
    [21, 22, null, 23, 24],
    [25, 26, null, 27, 28],
    [29, 30, null, 31, 32],
    [33, 34, null, 35, 36],
    [37, 38, null, 39, 40],
    [41, 42, null, 43, 44],
    [45, 46, 47, 48, 49, 50], // Last row with 6 seats
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <h2 className="text-2xl font-bold mb-6">Book Your Seats</h2>
      {loading && <p>Loading seats...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Driver Image */}
      <div className="mb-4">
        <img src="/assets/driver.png" alt="Driver Seat" className="w-24 h-24 mx-auto" />
      </div>

      {/* Seat Layout */}
      <div className="flex flex-col space-y-2 mb-6">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {row.map((seatNumber, seatIndex) =>
              seatNumber === null ? (
                <div key={seatIndex} className="w-12"></div> // Aisle space
              ) : (
                <motion.div
                  key={seatNumber}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    handleSeatClick(seats.find((s) => s.seatNumber === seatNumber) || {})
                  }
                  className={`w-12 h-12 flex items-center justify-center rounded cursor-pointer shadow-md transition-all 
                    ${
                      seats.find((s) => s.seatNumber === seatNumber)?.status === "booked"
                        ? "bg-red-500 text-white"
                        : selectedSeats.includes(seatNumber)
                        ? "bg-green-500 text-white"
                        : "bg-white border"
                    }`}
                >
                  {seatNumber}
                </motion.div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Selected Seats & Total Payment Section */}
      <motion.div
        className="bg-white p-4 rounded-lg shadow-lg mb-6 w-full max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg font-semibold mb-2">Selected Seats:</p>
        <p className="text-xl font-bold">{selectedSeats.join(", ") || "None"}</p>
        <hr className="my-2" />
        <p className="text-lg font-semibold">Total Price:</p>
        <p className="text-2xl font-bold text-green-600">Rs.{selectedSeats.length * 2000}</p>
      </motion.div>

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

      {/* Confirm Booking Button */}
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
