const KitchenProject = require("../models/KitchenProject");

exports.createKitchenProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const project = new KitchenProject({ title, description, imageUrl });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllKitchenProjects = async (req, res) => {
  try {
    const projects = await KitchenProject.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteKitchenProject = async (req, res) => {
  try {
    const project = await KitchenProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
