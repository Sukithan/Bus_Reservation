import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-white text-3xl font-bold tracking-wide">
          🚌 NCG Bus Admin
        </h1>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <NavItem to="/dashboard" text="📊 Dashboard" />
          <NavItem to="/add-bus" text="➕ Add Bus" />
          <NavItem to="/delete-seats" text="🗑️ Delete Seats" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white text-xl focus:outline-none">
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

// Reusable Nav Item Component
const NavItem = ({ to, text }) => {
  return (
    <Link
      to={to}
      className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300"
    >
      {text}
    </Link>
  );
};

export default Navbar;
