// routes/productVendor.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getProductVendorsController,
    createProductVendorController,
 } from "../controllers/productVendor.controller.js";

const router = Router();

// router.use(verifyJWT(['Admin']));// specify roles if needed

// Protected route: only authenticated users
router.get("/vendors", getProductVendorsController);


// Only Admin can perform actions
router.post("/action/:productId", createProductVendorController);

export default router;
