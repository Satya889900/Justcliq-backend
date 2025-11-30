// // middlewares/attachFileToBody.js
// export const attachFileToBody = (fieldName) => {
//   return (req, res, next) => {
//     if (!req.body) req.body = {}; // initialize if undefined
//     if (req.file && req.file.path) {
//       req.body[fieldName] =
//         req.file.path || req.file.url || req.file.secure_url; // multer + Cloudinary URL
//     }
//     console.log("🚀 req.file:", req.file);
//     console.log("🚀 req.body after Multer:", req.body);

//     console.log("🚀 attachFileToBody req.body:", req.body);
//     next();
//   };
// };
// middlewares/attachFileToBody.js
import { v2 as cloudinary } from "cloudinary";

export const attachFileToBody = (fieldName) => {
  return async (req, res, next) => {
    try {
      if (!req.body) req.body = {};

      // No file uploaded → skip
      if (!req.file) {
        return next();
      }

      console.log("📸 Uploaded file received:", req.file);

      // -----------------------
      // CASE 1 ― CloudinaryStorage
      // -----------------------
      if (req.file.secure_url) {
        req.body[fieldName] = req.file.secure_url;
        return next();
      }

      // -----------------------
      // CASE 2 ― Cloudinary URL in path
      // -----------------------
      if (req.file.path && req.file.path.includes("cloudinary")) {
        req.body[fieldName] = req.file.path;
        return next();
      }

      // -----------------------
      // CASE 3 ― Local file → Upload to Cloudinary
      // -----------------------
      if (req.file.path) {
        console.log("☁ Uploading to Cloudinary (manual)...");
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });

        req.body[fieldName] = result.secure_url;
        return next();
      }

      // -----------------------
      // CASE 4 ― If still no URL → throw
      // -----------------------
      return res.status(400).json({
        success: false,
        message: "Image upload failed — no Cloudinary URL",
      });
    } catch (error) {
      console.error("❌ attachFileToBody ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Image processing failed",
        error: error.message,
      });
    }
  };
};
