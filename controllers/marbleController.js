const Marble = require("../models/Marble");
const {
  uploadImageToR2,
  getSignedImageUrl,
  extractR2Key,
} = require("../utils/r2ImageService");

exports.createMarble = async (req, res) => {
  try {
    const { name, stock, status } = req.body;
    let imageUrl = "";

    if (req.file) {
      const key = await uploadImageToR2(req.file);
      imageUrl = `/uploads/${key}`;
    }

    const marble = new Marble({ name, stock, status, imageUrl });
    await marble.save();
    res.status(201).json(marble);
  } catch (err) {
    console.error("Create Marble Error:", err);
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

    const withSignedUrls = await Promise.all(
      marbles.map(async (marble) => {
        const m = marble.toObject();
        const key = extractR2Key(m.imageUrl);
        m.signedUrl = key ? await getSignedImageUrl(key) : "";
        return m;
      })
    );

    res.json(withSignedUrls);
  } catch (err) {
    console.error("Fetch Marbles Admin Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.updateMarble = async (req, res) => {
  try {
    const { name, stock, status } = req.body;
    const update = { name, stock, status };

    if (req.file) {
      const key = await uploadImageToR2(req.file);
      update.imageUrl = `/uploads/${key}`;
    }

    const marble = await Marble.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!marble) return res.status(404).json({ msg: "Marble not found" });

    res.json(marble);
  } catch (err) {
    console.error("Update Marble Error:", err);
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
    if (!marble) return res.status(404).json({ msg: "Marble not found" });

    const m = marble.toObject();
    const key = extractR2Key(m.imageUrl);
    m.signedUrl = key ? await getSignedImageUrl(key) : "";

    res.json(m);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
