import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

console.log("Cloudinary Config:", 
//   {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "❌ Missing",
//   api_key: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
// }
);


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
