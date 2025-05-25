const CompletedProject = require("../models/CompletedProject");

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const project = new CompletedProject({ title, description, imageUrl });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await CompletedProject.find();
    res.json(projects);
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
