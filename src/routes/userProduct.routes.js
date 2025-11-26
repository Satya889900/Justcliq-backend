import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import uploadProduct from "../middlewares/uploadProduct.js";
// import upload from "../middlewares/uploadMiddleware.js";
import {
  addUserProductController,
  getMyProductsController,
  getApprovedProductsController,
  getApprovedProductByIdController,
  getApprovedProductsByCategoryController,
  updateUserProductController,
  deleteUserProductController
} from "../controllers/userProduct.controller.js";

const router = Router();

// 🔐 Protect all routes
router.use(verifyJWT(["User"]));

// ➕ Add user product
router.post(
  "/add",
  uploadProduct.single("image"),
  addUserProductController
);

// 👤 User's own products
router.get("/my-products", getMyProductsController);

// 🟢 Get all approved products
router.get("/", getApprovedProductsController);

// 🟢 Get approved products by category
router.get("/category/:categoryId", getApprovedProductsByCategoryController);

// 🟢 Get approved product by ID
router.get("/:productId", getApprovedProductByIdController);

// UPDATE product (FormData)
router.put(
  "/update/:productId",
  uploadProduct.single("image"),
  updateUserProductController
);

// 🗑 Delete product
router.delete("/delete/:productId", deleteUserProductController);

export default router;
