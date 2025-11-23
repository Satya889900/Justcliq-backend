import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "admin_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    public_id: (req, file) =>
      `admin-${req.user._id}-${Date.now()}`, // Unique name for the image
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const uploadAdminImage = multer({ storage }).single("profileImage");
