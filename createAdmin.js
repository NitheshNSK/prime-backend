// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new Admin({
    email: "admin@prime.com",
    password: hashedPassword,
  });
  await admin.save();
  console.log("Admin created");
  process.exit();
});
