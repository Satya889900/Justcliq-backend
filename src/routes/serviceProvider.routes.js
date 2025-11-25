// import { Router } from 'express';
// import { verifyJWT } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/uploadMiddleware.js";

// import {
//   createServiceProviderProfileController,
//   getMyServiceProviderProfileController,
//   getApprovedProvidersByServiceNameController,
//   updateServiceProviderActionController,
//   getServiceProvidersListController
// } from "../controllers/serviceProvider.controller.js";

// const router = Router();

// // Create provider profile
// router.post("/create", verifyJWT(["User"]), upload.single("image"), createServiceProviderProfileController);

// // Get my provider profile
// router.get("/my", verifyJWT(["User"]), getMyServiceProviderProfileController);

// // Get approved providers by service name
// router.get("/service-providers/by-name/:serviceName", getApprovedProvidersByServiceNameController);

// // Get all providers (admin)
// router.get("/serviceproviders", getServiceProvidersListController);

// // Admin approve/reject
// router.patch("/services/:serviceId/action", updateServiceProviderActionController);
import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

import {
  createServiceProviderProfileController,
  getMyServiceProviderProfileController,
  getApprovedProvidersByServiceNameController,
  updateServiceProviderActionController,
  getServiceProvidersListController,
  deleteMyServiceProviderProfileController,
  updateMyServiceProviderProfileController
} from "../controllers/serviceProvider.controller.js";

const router = Router();

// Create provider profile (User)
router.post(
  "/create",
  upload.single("image"),
  createServiceProviderProfileController
);
router.put(
  "/update/:serviceId",
  upload.single("image"),
  updateMyServiceProviderProfileController
);


// Get my provider profile (User)
router.get("/my", verifyJWT(["User"]), getMyServiceProviderProfileController);

// Get approved providers by service name
router.get("/service-providers/by-name/:serviceName", getApprovedProvidersByServiceNameController);

// Get all providers (Admin)
router.get("/serviceproviders", getServiceProvidersListController);

// Admin approve/reject
router.patch(
  "/services/:serviceId/action",
  updateServiceProviderActionController
);

// Delete provider profile
router.delete(
  "/delete/:serviceId",
  verifyJWT(["User"]),
  deleteMyServiceProviderProfileController
);


export default router;
