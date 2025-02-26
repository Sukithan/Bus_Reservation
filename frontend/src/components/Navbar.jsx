import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 backdrop-blur-md text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Brand Name */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide text-white">
          <motion.span 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-yellow-300"
          >
            SafeHorizon Travels
          </motion.span>
        </Link>

        {/* Navigation Links with Boxes */}
        <ul className="flex space-x-6">
          {[
            { path: "/", label: "Home" },
            { path: "/auth/login", label: "Login" },
            { path: "/contact", label: "Contact Us" },
          ].map((item, index) => (
            <motion.li 
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link 
                to={item.path} 
                className="relative px-5 py-2 text-lg font-semibold transition-all duration-300 rounded-lg bg-white text-blue-700 shadow-md hover:bg-yellow-300 hover:text-black border-2 border-blue-400"
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Profile Picture (Right Corner) */}
        <Link to="/UserDetails">
          <motion.img
            src="/assets/profile.png"
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-white shadow-lg transition-all hover:border-yellow-400 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          />
        </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
