const express = require("express");
const router = express.Router();
const {
  loginWithPassword,
  verifyOtp,
} = require("../controllers/authController");

router.post("/login", loginWithPassword);

router.post("/verify-otp", verifyOtp);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
});
module.exports = router;
