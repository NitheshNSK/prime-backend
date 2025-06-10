const CompletedProject = require("../models/CompletedProject");
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
      imageUrl = `/uploads/${key}`;
    }

    const project = new CompletedProject({ title, description, imageUrl });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await CompletedProject.find();

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
    const project = await CompletedProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
