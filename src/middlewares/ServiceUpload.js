import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "services",
    allowed_formats: ["jpg", "jpeg", "png","webp","avif"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

export const uploadServiceImage = multer({ storage }).single("image");
