const Categories = require("../models/Categories");
const {
  uploadImageToR2,
  getSignedImageUrl,
  extractR2Key,
} = require("../utils/r2ImageService");

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = "";

    if (req.file) {
      const key = await uploadImageToR2(req.file);
      imageUrl = `${key}`;
    }

    const category = new Categories({ title, description, imageUrl });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Categories.find();

    const withSignedUrls = await Promise.all(
      projects.map(async (project) => {
        const p = project.toObject();
        const key = extractR2Key(p.imageUrl);
        p.signedUrl = key ? await getSignedImageUrl(key) : "";
        return p;
      })
    );

    res.json(withSignedUrls);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Categories.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
