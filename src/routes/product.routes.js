import { Router } from "express";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/uploadMiddleware.js";
import {
  getProductsByCategoryController,
  addProduct,
  getProductController,
  getCategoryNameByProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";
import upload from "../middlewares/uploadProduct.js";


const router = Router();

// GET all products
router.get("/", getAllProductsController);

// GET products by category
router.get("/category/:categoryId", getProductsByCategoryController);

// POST a new product
router.post("/", upload.single("image"), attachFileToBody("image"), addProduct);

// GET category name for a product
router.get("/:productId/category", getCategoryNameByProductController);

// GET a single product by its ID
router.get("/:productId", getProductController);

// PUT to update a product
router.put("/:productId", upload.single("image"), attachFileToBody("image"), updateProductController);

// DELETE a product
router.delete("/:productId", deleteProductController);

export default router;
