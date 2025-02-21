import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SeatDelete = () => {
  const { busId } = useParams();  // Get busId from URL
  const navigate = useNavigate();
  const [bookedSeats, setBookedSeats] = useState(new Set()); // Stores booked seat numbers as a Set
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!busId) {
      setError("Invalid Bus ID");
      return;
    }

    const fetchSeats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/admin/delete/${busId}`);
        if (response.data && Array.isArray(response.data)) {
          setBookedSeats(new Set(response.data)); // Store as a Set for faster lookup
        } else {
          setError("No booked seats found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch booked seats.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [busId]);

  const handleSeatClick = (seatNumber) => {
    if (!bookedSeats.has(seatNumber)) return; // Only allow selection of booked seats

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleDelete = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select booked seats to delete.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/admin/delete/seat", {
        busId,
        selectedSeats,
      });
      alert("Seats successfully deleted!");
      setBookedSeats(new Set([...bookedSeats].filter(seat => !selectedSeats.includes(seat)))); // Remove deleted seats from UI
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete seats.");
    } finally {
      setLoading(false);
    }
  };

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
    [45, 46, 47, 48, 49, 50],
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6">Delete Booked Seats for Bus {busId}</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <img src="/assets/driver.png" alt="Driver Seat" className="w-24 h-24 mx-auto" />
      </div>

      <div className="flex flex-col space-y-2 mb-6">
        {seatLayout.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center space-x-2">
            {row.map((seatNumber, seatIndex) =>
              seatNumber === null ? (
                <div key={`empty-${rowIndex}-${seatIndex}`} className="w-12"></div>
              ) : (
                <motion.div
                  key={`seat-${seatNumber}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSeatClick(seatNumber)}
                  className={`w-12 h-12 flex items-center justify-center rounded cursor-pointer shadow-md transition-all 
                    ${
                      bookedSeats.has(seatNumber)
                        ? "bg-red-500 text-white"  // Booked seats in red
                        : "bg-gray-300"
                    } ${selectedSeats.includes(seatNumber) ? "border-4 border-yellow-500" : ""}`}
                >
                  {seatNumber}
                </motion.div>
              )
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Selected Seats"}
      </button>
    </div>
  );
};

export default SeatDelete;
