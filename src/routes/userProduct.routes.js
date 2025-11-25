import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";

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
router.post("/add", addUserProductController);

// 👤 User's own products
router.get("/my-products", getMyProductsController);

// 🟢 Get all approved products
router.get("/", getApprovedProductsController);

// 🟢 Get approved products by category
router.get("/category/:categoryId", getApprovedProductsByCategoryController);

// 🟢 Get approved product by ID
router.get("/:productId", getApprovedProductByIdController);

// ✏ Update product
router.put("/update/:productId", updateUserProductController);

// 🗑 Delete product
router.delete("/delete/:productId", deleteUserProductController);

export default router;
