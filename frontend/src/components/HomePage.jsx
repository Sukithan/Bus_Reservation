import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "api key code", // Replace with your actual API key
  dangerouslyAllowBrowser: true,
});

const HomePage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const navigate = useNavigate();

  const messages = [
    "🚍 Welcome to SafeHorizon Travels! 🌍",
    "🎉 1000+ Safety Rides Completed! 🚀",
    "🌟 15,000+ Happy Passengers! 😄",
    "🛣️ Book Your Next Journey Safely! ✈️",
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const searchBuses = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const response = await axios.get("http://localhost:5000/api/buses", {
        params: { route_from: from, route_to: to, date: formattedDate },
      });
      setBuses(response.data.length === 0 ? [] : response.data);
      setError(response.data.length === 0 ? "No buses available for the selected route and date." : null);
    } catch (err) {
      setError("Fetching error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bookSeat = (busId) => {
    navigate(`/booking/${busId}`);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newUserMessage = { sender: "user", message: chatInput };
    setChatMessages((prev) => [...prev, newUserMessage, { sender: "chatbot", message: "Thinking..." }]);
    setChatInput("");
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are a helpful travel assistant." }, { role: "user", content: chatInput }],
      });
      const botResponse = response.choices[0].message.content;
      setChatMessages((prev) => [...prev.slice(0, -1), { sender: "chatbot", message: botResponse }]);
    } catch (err) {
      setChatMessages((prev) => [...prev.slice(0, -1), { sender: "chatbot", message: "Error fetching response. Try again." }]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url(/assets/ncg.jpg)" }}>
      <div className="flex-1 flex flex-col items-center justify-start p-4">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold mb-4 text-white bg-blue-600 rounded-lg p-4">
          SafeHorizon Travels 🚍
        </motion.h2>
        <motion.div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-700">Search Buses 🚐</h1>
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
            <motion.button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Search Buses
            </motion.button>
          </form>
          {loading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </motion.div>
        <div className="mt-8 space-y-8 w-full max-w-4xl">
          {buses.map((bus) => (
            <motion.div key={bus.id} className="p-4 bg-white shadow-md rounded-md flex justify-between items-center">
              <img src="/assets/sample.jpeg" alt="Bus Image" className="w-40 h-28 object-cover rounded-md" />
              <div>
                <h2 className="text-xl font-bold">Bus ID: {bus.id}</h2>
                <p>Departure: {bus.departure_time}</p>
                <p>Arrival: {bus.arrival_time}</p>
                <p>Journey Time: {bus.journey_time}</p>
                <button onClick={() => bookSeat(bus.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Book Seat</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center p-6 space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h2 className="text-xl font-bold text-white">{messages[messageIndex]}</h2>
        </motion.div>
        <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6 relative">
          <div className="h-64 overflow-auto space-y-2 p-2 border rounded-lg">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>{msg.message}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="flex items-center space-x-2 mt-4">
            <input type="text" placeholder="Ask me anything..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="p-2 border rounded w-full" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
