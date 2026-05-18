const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary using env variables (to be set after requiring dotenv in index.js)
// But to ensure it's initialized, we'll export a setup function or just expect env vars are loaded
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hiregenius_resumes',
    // We can allow raw files (PDFs, docs)
    resource_type: 'auto',
    allowed_formats: ['pdf', 'doc', 'docx']
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
