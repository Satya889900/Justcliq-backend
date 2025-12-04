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



// ➕ Add user product
router.post("/add", uploadProduct.single("image"), addUserProductController);

// 👤 User's own products
router.get("/my-products", getMyProductsController);

// 🟢 Approved products
router.get("/", getApprovedProductsController);

router.get("/category/:categoryId", getApprovedProductsByCategoryController);
router.get("/:productId", getApprovedProductByIdController);

router.put("/update/:productId", uploadProduct.single("image"), updateUserProductController);

router.delete("/delete/:productId", deleteUserProductController);
export default router;
