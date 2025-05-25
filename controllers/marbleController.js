const Marble = require("../models/Marble");

exports.createMarble = async (req, res) => {
  try {
    const { name, stock, status } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const marble = new Marble({ name, imageUrl, stock, status });
    await marble.save();
    res.status(201).json(marble);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllMarblesPublic = async (req, res) => {
  try {
    const marbles = await Marble.find({ status: "Available" });
    res.json(marbles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllMarblesAdmin = async (req, res) => {
  try {
    const marbles = await Marble.find();
    res.json(marbles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateMarble = async (req, res) => {
  try {
    const { name, stock, status } = req.body;
    const update = { name, stock, status };
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    const marble = await Marble.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!marble) return res.status(404).json({ msg: "Not found" });
    res.json(marble);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteMarble = async (req, res) => {
  try {
    const marble = await Marble.findByIdAndDelete(req.params.id);
    if (!marble) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getMarbleById = async (req, res) => {
  try {
    const marble = await Marble.findById(req.params.id);
    if (!marble) {
      return res.status(404).json({ msg: "Marble not found" });
    }
    res.json(marble);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
