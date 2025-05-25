const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "http://127.0.0.1:5501",
      "http://localhost:3001",
      "https://prime-landing-page-zeta.vercel.app",
      "https://prime-admin-ten.vercel.app",
    ],
    credentials: true, // If using cookies or auth headers
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB Config
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const marbleRoutes = require("./routes/marbleRoutes");
const completedProjectRoutes = require("./routes/completedProjectRoutes");
const kitchenProjectRoutes = require("./routes/kitchenProjectRoutes");
app.use("/api/projects", completedProjectRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/marbles", marbleRoutes);
app.use("/api/kitchen-projects", kitchenProjectRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
