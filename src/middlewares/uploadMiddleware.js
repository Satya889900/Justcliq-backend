// middlewares/uploadMiddleware.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profileImages", // Cloudinary folder for profile images
    allowed_formats: ["jpeg", "jpg", "png", "webp","avif"], // Allowed formats
    public_id: (req, file) =>
      `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}`, // Unique ID
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional resize
  },
});

// ✅ Multer upload middleware
export const upload = multer({ storage });
