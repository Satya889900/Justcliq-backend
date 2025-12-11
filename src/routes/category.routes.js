import { Router } from "express";
import { getCategoriesController,
    getServiceController,
getProductCategoriesController,searchServiceCategoriesByPrefixController,searchProductCategoriesByPrefixController } from "../controllers/category.controller.js";


import { 
  getServicesByCategoryController,
  getSingleSubCategoryController
} from "../controllers/service.controller.js"; 

import { 
  getProductController 
} from "../controllers/product.controller.js"; 
// import { getProductCategoriesController } from "../controllers/category.controller.js";

const router = Router();

//service categories
// JWT-protected route for users
router.get("/service-categories",  getCategoriesController);

//product categories
// ✅ Protected route
// ✅ Product categories (fruits, vegetables, grocery, chocolates, dairy, etc.)
router.get("/product-categories",  getProductCategoriesController);

// Get all subcategories (services) under a category
router.get("/service-categories/:categoryId/services", getServicesByCategoryController);
router.get("/product/:productId", getProductController);
router.get(
  "/subcategory/:subCategoryId",
  getSingleSubCategoryController
);
router.get("/search", searchServiceCategoriesByPrefixController);
router.get("/product-search", searchProductCategoriesByPrefixController);

// Protected route: only users
router.get("/:serviceId", getServiceController);


export default router;
