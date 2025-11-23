// // src/routes/featuredProduct.routes.js
// import { Router } from "express";

// import {
//   addFeaturedProductController,
//   updateFeaturedProductController,
//   deleteFeaturedProductController,
//   getAllFeaturedProductsController,
// } from "../controllers/featuredProduct.controller.js";

// import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
// import { attachFileToBody } from "../middlewares/attachFileToBody.js";

// const router = Router();

// // Add Featured Product
// router.post(
//   "/products",
//   uploadServiceImage,
//   attachFileToBody("image"),
//   addFeaturedProductController
// );

// // Get all Featured Products
// router.get("/products", getAllFeaturedProductsController);

// // Update Featured Product
// router.put(
//   "/products/:productId",
//   uploadServiceImage,
//   attachFileToBody("image"),
//   updateFeaturedProductController
// );

// // Delete Featured Product
// router.delete("/products/:productId", deleteFeaturedProductController);

// export default router;
// // 

// src/routes/featuredProduct.routes.js
import { Router } from "express";

import {
  addFeaturedProductController,
  updateFeaturedProductController,
  deleteFeaturedProductController,
  getAllFeaturedProductsController,
} from "../controllers/featuredProduct.controller.js";

import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

/* USER + ADMIN */
router.get("/products", verifyJWT(), getAllFeaturedProductsController);

/* >>> FIX: MULTER BEFORE VALIDATE <<< */
router.post(
  "/products",
  verifyJWT(["Admin"]),
  isAdmin,
  uploadServiceImage,              // ✔ multer first
  attachFileToBody("image"),       // ✔ file added to body
  ...addFeaturedProductController  // ✔ validation after multer
);

router.put(
  "/products/:productId",
  verifyJWT(["Admin"]),
  isAdmin,
  uploadServiceImage,              // ✔ must be before validate
  attachFileToBody("image"),
  ...updateFeaturedProductController
);

router.delete(
  "/products/:productId",
  verifyJWT(["Admin"]),
  isAdmin,
  ...deleteFeaturedProductController
);

export default router;
