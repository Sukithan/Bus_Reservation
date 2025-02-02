import React, { useEffect, useState } from "react";
import { fetchBusTimes } from "../services/api";
import { Link } from "react-router-dom";

const BusTimes = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    fetchBusTimes()
      .then((res) => setBuses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Bus Times</h1>
      <ul>
        {buses.map((bus) => (
          <li key={bus.id} className="mb-4">
            <Link to={`/booking/${bus.id}`} className="btn-primary">
              {bus.route} - {bus.time}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusTimes;
