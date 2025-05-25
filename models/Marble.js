const mongoose = require("mongoose");

const MarbleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marble", MarbleSchema);
