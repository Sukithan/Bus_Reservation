require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); 
const adminRoutes = require("./routes/adminRoutes");
const adminbusRoutes = require("./routes/adminbusRoutes");
const seatdeleteRoutes = require("./routes/seatdeleteRoutes");
const busConfirmationRoutes = require("./routes/busConfirmationRoutes");


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/admin", adminRoutes);
app.use("/api/admin/buses", adminbusRoutes);
app.use("/api/admin/delete", seatdeleteRoutes);
app.use("/api", busConfirmationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
