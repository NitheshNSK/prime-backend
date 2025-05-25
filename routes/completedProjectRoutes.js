const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
  createProject,
  getAllProjects,
  deleteProject,
} = require("../controllers/completedProjectController");

// Public
router.get("/", getAllProjects);

// Admin
router.post("/", auth, upload.single("image"), createProject);
router.delete("/:id", auth, deleteProject);

module.exports = router;
