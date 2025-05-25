// controllers/authController.js
const Admin = require("../models/Admin");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sahashnsk@gmail.com",
    pass: "bcan iedx atwt loef",
  },
});

exports.loginWithPassword = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Admin not found" });

  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword)
    return res.status(401).json({ message: "Invalid password" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await Otp.create({ email, otp, expiresAt });

  await transporter.sendMail({
    from: `"Prime Marble" <${process.env.ADMIN_EMAIL}>`,
    to: "letsdoveera@gmail.com",
    subject: "Your OTP",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  });

  res.json({ success: true, message: "OTP sent" });
};
const jwt = require("jsonwebtoken");

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email: "admin@prime.com" }).sort({
    createdAt: -1,
  });

  if (!record) return res.status(400).json({ message: "OTP not found" });
  if (record.otp !== parseInt(otp))
    return res.status(400).json({ message: "Incorrect OTP" });
  if (new Date() > record.expiresAt)
    return res.status(400).json({ message: "OTP expired" });

  // Optional: delete all expired OTPs
  await Otp.deleteMany({ email });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ success: true, token });
};
