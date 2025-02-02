import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Adjust to your backend server's base URL
});

// Add a token to the header if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post("/api/users/login", data);
export const signup = (data) => API.post("/api/users/signup", data);
export const fetchBusTimes = () => API.get("/booking/bus-times");
export const fetchBusSeats = (busId) => API.get(`/booking/seats/${busId}`);
export const bookSeat = (data) => API.post("/booking/book-seat", data);
