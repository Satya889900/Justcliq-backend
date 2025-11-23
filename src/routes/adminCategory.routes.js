import { Router } from "express";
import { addCategoryController,deleteServiceCategoryController } from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { uploadCategoryImage } from "../middlewares/uploadCategoryMiddleware.js";

import { addProductCategoryController,
  editCategoryController, 
  editProductCategoryController,
  deleteProductCategoryController,
 } from "../controllers/category.controller.js";

const router = Router();

router.post(
  "/category",
  uploadCategoryImage.single("image"), // upload file
  addCategoryController
);
router.post(
  "/product-category",
  uploadCategoryImage.single("image"),
  addProductCategoryController
);

router.put("/service-category/:categoryId",
   editCategoryController);


router.delete("/service-category/:categoryId",
   deleteServiceCategoryController);

router.put("/product-category/:categoryId",
   uploadCategoryImage
   .fields([{ name: "image", maxCount: 1 }]), // optional  
   editProductCategoryController);
router.delete("/product-category/:categoryId",
   deleteProductCategoryController);

export default router;
