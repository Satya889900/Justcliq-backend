// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// // Storage for product images
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "productImages",
//     allowed_formats: ["jpeg", "jpg", "png", "webp", "avif"],
//     public_id: (req, file) => `product-${Date.now()}`, 
//   },
// });


// const upload = multer({ storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
//  });

// export default upload;
// uploadProduct.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// Multer upload using Cloudinary
const upload = multer({ storage });

export default upload;

