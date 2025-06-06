const mongoose = require("mongoose");

const CategoriesProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", CategoriesProjectSchema);
