import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AddBus from "./pages/AddBus";
import DeleteSeatsPage from "./pages/DeleteSeatPage";
import SeatDelete from "./pages/SeatDelete";
import BusConfirmation from "./pages/BusConfirmation";
import Navbar from "./pages/Navbar";

function Layout() {
  const location = useLocation();
  const hideNavbarOnPaths = ["/"]; // Paths where navbar should be hidden

  return (
    <div>
      {!hideNavbarOnPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-bus" element={<AddBus />} />
        <Route path="/delete-seats" element={<DeleteSeatsPage />} />
        <Route path="/seatdelete/:busId" element={<SeatDelete />} />
        <Route path="/bus-confirmation/:busId" element={<BusConfirmation />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
