import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BusRoutes from "./pages/BusRoutes";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar"; // Import the Navbar component
import About from "./pages/About"; // Add the About Us page
import Contact from "./pages/Contact"; // Add the Contact Us page
import BookingDetails from "./pages/BookingDetails";
import UserDetails from "./pages/UserDetails"; // Add the Contact Us page

const App = () => (
  <Router>
    {/* Common Navbar */}
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buses" element={<BusRoutes />} />
      <Route path="/booking/:busId" element={<Booking />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/about" element={<About />} /> {/* About Us Route */}
      <Route path="/contact" element={<Contact />} /> {/* Contact Us Route */}
      <Route path="/BookingDetails/:bookingId" element={<BookingDetails />} />
      <Route path="/UserDetails" element={<UserDetails />} /> 
      
    </Routes>
  </Router>
);

export default App;
