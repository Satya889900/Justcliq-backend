import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { adminGetProvidersByServiceNameController } from "../controllers/adminServiceProvider.controller.js";

const router = Router();

// ⭐ ONLY ADMIN CAN ACCESS
router.get(
  "/providers/by-name/:serviceName",
  verifyJWT(["Admin"]),
  isAdmin,
  adminGetProvidersByServiceNameController
);

export default router;
