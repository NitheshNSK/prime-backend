const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const r2 = require("./r2"); // your R2/S3 client
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
      "https://prime-landing-page-chi.vercel.app",
      "https://prime-admin-lovat.vercel.app",
      "https://demo.app.primemarblenyc.com",
      "https://demo.primemarblenyc.com",
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
const categoriesRoutes = require("./routes/categoriesRoutes");
app.use("/api/projects", completedProjectRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/marbles", marbleRoutes);
app.use("/api/kitchen-projects", kitchenProjectRoutes);
app.use("/api/categories", categoriesRoutes);
app.get("/api/:fileName", async (req, res) => {
  const fileName = req.params.fileName;

  const command = new GetObjectCommand({
    Bucket: "uploads",
    Key: fileName,
  });

  try {
    const result = await r2.send(command);
    res.setHeader("Content-Type", result.ContentType || "image/jpeg");
    result.Body.pipe(res);
  } catch (err) {
    console.error("View error:", err);
    res.status(404).send("Image not found");
  }
});
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
