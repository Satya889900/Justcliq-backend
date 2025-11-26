import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Storage for product images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "productImages",
    allowed_formats: ["jpeg", "jpg", "png", "webp", "avif"],
    public_id: (req, file) => `product-${Date.now()}`, 
  },
});


const upload = multer({ storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
 });

export default upload;
