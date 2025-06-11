const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
  createMarble,
  getAllMarblesPublic,
  getAllMarblesAdmin,
  updateMarble,
  deleteMarble,
  getMarbleById,
} = require("../controllers/marbleController");

// Public API
router.get("/user", getAllMarblesAdmin);

// Admin APIs
router.get("/admin", auth, getAllMarblesAdmin);
router.post("/", auth, upload.single("image"), createMarble);
router.put("/:id", auth, upload.single("image"), updateMarble);
router.delete("/:id", auth, deleteMarble);
router.get("/:id", getMarbleById);
module.exports = router;
