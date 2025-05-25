// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    expiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
