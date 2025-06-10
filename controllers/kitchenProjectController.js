const KitchenProject = require("../models/KitchenProject");
const {
  uploadImageToR2,
  getSignedImageUrl,
  extractR2Key,
} = require("../utils/r2ImageService");

exports.createKitchenProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = "";

    if (req.file) {
      const key = await uploadImageToR2(req.file);
      imageUrl = `/uploads/${key}`;
    }

    const project = new KitchenProject({ title, description, imageUrl });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Create KitchenProject Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.updateKitchenProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const update = { title, description };

    if (req.file) {
      const key = await uploadImageToR2(req.file);
      update.imageUrl = `/uploads/${key}`;
    }

    const project = await KitchenProject.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
      }
    );

    if (!project) return res.status(404).json({ msg: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Update KitchenProject Error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllKitchenProjects = async (req, res) => {
  try {
    const projects = await KitchenProject.find();

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

exports.deleteKitchenProject = async (req, res) => {
  try {
    const project = await KitchenProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
