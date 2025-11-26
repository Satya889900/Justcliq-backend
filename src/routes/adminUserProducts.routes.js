import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { adminGetAllUserProductsController } from "../controllers/adminUserProducts.controller.js";

const router = Router();

// Only Admin can access all user products
router.get("/all", verifyJWT(["Admin"]), adminGetAllUserProductsController);

export default router;
