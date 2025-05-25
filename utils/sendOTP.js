// utils/sendOTP.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_APP_PASSWORD, // Use App Password
  },
});

exports.sendOTP = async ( otp) => {
  const mailOptions = {
    from: `"Prime Marble Admin" <${process.env.ADMIN_EMAIL}>`,
    to: "sahashnsk@gmail.com",
    subject: "Your Login OTP",
    html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>This OTP is valid for 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", "");
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw err;
  }
};
