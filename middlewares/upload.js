// middlewares/upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // ✅ this gives req.file.buffer
const upload = multer({ storage });

module.exports = upload;
