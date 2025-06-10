const s3 = require("../r2");
require("dotenv").config();
// Uploads image to R2 and returns the key (e.g. "1718052112311-image.jpg")
async function uploadImageToR2(file) {
  const key = `${Date.now()}-${file.originalname}`;
  await s3
    .putObject({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    })
    .promise();

  return key;
}

// Generates a signed URL for a given R2 file key
function getSignedImageUrl(key, expiresIn = 3600) {
  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Expires: expiresIn,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
}

// Extracts just the R2 key from stored imageUrl (e.g. from `/uploads/xxx.jpg`)
function extractR2Key(imageUrl) {
  if (!imageUrl) return "";
  return imageUrl.split("/").pop();
}

module.exports = {
  uploadImageToR2,
  getSignedImageUrl,
  extractR2Key,
};
