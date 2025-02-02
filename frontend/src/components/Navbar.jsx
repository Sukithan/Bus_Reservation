import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 backdrop-blur-md text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Navigation Links with Animated Gradient Boxes */}
        <ul className="flex space-x-6">
          {[
            { path: "/", label: "Home" },
            { path: "/auth/login", label: "Login" },
            // { path: "/about", label: "About Us" },
            { path: "/contact", label: "Contact Us" },
          ].map((item, index) => (
            <motion.li 
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 rounded-lg opacity-80 transition-all duration-300"
              ></motion.div>
              <Link to={item.path} className="relative z-10 px-4 py-2 block text-lg font-bold text-black">
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
            className="w-12 h-12 rounded-full border-2 border-white shadow-lg hover:border-green-300 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          />
        </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
