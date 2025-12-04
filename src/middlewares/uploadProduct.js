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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProduct = multer({ storage });

export default uploadProduct;
