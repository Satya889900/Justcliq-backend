// import { Router } from "express";
// import {
//   addFeaturedServiceController,
//   updateFeaturedServiceController,
//   deleteFeaturedServiceController,
//   getAllFeaturedServicesController,
// } from "../controllers/featuredService.controller.js";

// import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
// import { attachFileToBody } from "../middlewares/attachFileToBody.js";

// import { verifyJWT } from "../middlewares/authMiddleware.js";
// import { isAdmin } from "../middlewares/isAdmin.js";

// const router = Router();

// // USER + ADMIN (user sees only active)
// router.get("/services", verifyJWT(), getAllFeaturedServicesController);

// // ADMIN ONLY
// router.post(
//   "/services",
//   verifyJWT(["Admin"]),
//   isAdmin,
//   uploadServiceImage,
//   attachFileToBody("image"),
//   addFeaturedServiceController
// );

// router.put(
//   "/services/:serviceId",
//   verifyJWT(["Admin"]),
//   isAdmin,
//   uploadServiceImage,
//   attachFileToBody("image"),
//   updateFeaturedServiceController
// );

// router.delete(
//   "/services/:serviceId",
//   verifyJWT(["Admin"]),
//   isAdmin,
//   deleteFeaturedServiceController
// );

// export default router;


import { Router } from "express";
import {
  addFeaturedServiceController,
  updateFeaturedServiceController,
  deleteFeaturedServiceController,
  getAllFeaturedServicesController,
} from "../controllers/featuredService.controller.js";
import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

/**
 * USER + ADMIN
 * GET /admin/api/featured-services/services
 * - Admin: sees ALL (Active + Inactive)
 * - User: sees only Active
 */
router.get("/services", verifyJWT(), getAllFeaturedServicesController);

/**
 * ADMIN ONLY
 */
router.post(
  "/services",
  verifyJWT(["Admin"]),
  isAdmin,
  uploadServiceImage,
  attachFileToBody("image"),
  addFeaturedServiceController
);

router.put(
  "/services/:serviceId",
  verifyJWT(["Admin"]),
  isAdmin,
  uploadServiceImage,
  attachFileToBody("image"),
  updateFeaturedServiceController
);

router.delete(
  "/services/:serviceId",
  verifyJWT(["Admin"]),
  isAdmin,
  deleteFeaturedServiceController
);

export default router;
