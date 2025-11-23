// // routes/stock.routes.js
// import { Router } from "express";
// import {getItemsByCategoryController,
//      getAllCategoriesForStockController,
//      editProductController,
//       editServiceController,
//       batchUpdateStockController
//      } from "../controllers/stock.controller.js";



// const router = Router();

// // Optional: Add query validation (if you want filters in future)

// router.get("/category-items/:categoryId", getItemsByCategoryController);

// router.get("/categories", getAllCategoriesForStockController);

// // Product and Service edit endpoints — IDs passed in URL
// router.put("/edit/product/:productId", ...editProductController);
// router.put("/edit/service/:serviceId", ...editServiceController);
// router.post("/batch-update", ...batchUpdateStockController);

// export default router;


import { Router } from "express";
import {
  getAllCategoriesForStockController,
  getItemsByCategoryController,
  editProductController,
  editServiceController,
  batchUpdateStockController
} from "../controllers/stock.controller.js";

const router = Router();

/** -----------------------------
 *   STOCK CATEGORY APIS
 * ----------------------------- */

// ✅ Get all categories (service + product)
router.get("/categories", getAllCategoriesForStockController);

// ✅ Get items by category (query → type=product/service)
router.get("/category-items/:categoryId", getItemsByCategoryController);

// ✅ Edit product inside stock
router.put("/edit/product/:productId", ...editProductController);

// ✅ Edit service inside stock
router.put("/edit/service/:serviceId", ...editServiceController);

// ✅ Batch stock update (product/service)
router.post("/batch-update", ...batchUpdateStockController);

export default router;
