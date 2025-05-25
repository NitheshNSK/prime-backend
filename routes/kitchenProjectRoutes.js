const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
  createKitchenProject,
  getAllKitchenProjects,
  deleteKitchenProject,
} = require("../controllers/kitchenProjectController");

// Public route
router.get("/", getAllKitchenProjects);

// Admin routes
router.post("/", auth, upload.single("image"), createKitchenProject);
router.delete("/:id", auth, deleteKitchenProject);

module.exports = router;
