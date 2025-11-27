import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  getProductVendorsController,
  createProductVendorController,
  updateVendorAction
} from "../controllers/productVendor.controller.js";

const router = Router();

// ✔ Fetch vendor list
router.get("/vendors", getProductVendorsController);

// ✔ Create vendor action
router.post("/action/:productId", createProductVendorController);

// ❗ DO NOT add verifyJWT here (admin.routes.js already protects this)
router.put("/action/:productId", updateVendorAction);

export default router;
