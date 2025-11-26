// /*admin.routes.js*/

// import { Router } from 'express';
// import { attachFileToBody } from "../middlewares/attachFileToBody.js";
// import { verifyJWT } from '../middlewares/authMiddleware.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// import { login } from '../controllers/admin.controller.js';
// import { getAdminProfile,getCurrentUserController, refreshAccessTokenController } from '../controllers/admin.controller.js';
// import categoryRoutes from "./category.routes.js";
// import adminCategoryRoutes from "./adminCategory.routes.js";
// import serviceRoutes from "./service.routes.js";
// import productRoutes from "./product.routes.js";
// import { updateServiceController,deleteServiceController,getServiceProvidersList } from '../controllers/service.controller.js';
// import {uploadServiceImage} from "../middlewares/ServiceUpload.js";
// import upload from '../middlewares/uploadProduct.js';
// import { updateProductController,deleteProductController,  } from '../controllers/product.controller.js';
// import serviceProviderRoutes from "./serviceProvider.routes.js";
// import productVendorListRoutes from "./productVendor.routes.js";
// import serviceOrderRoutes from "./serviceOrder.routes.js";
// import productOrderRoutes from "./productOrder.routes.js";
// import stockRoutes from './stock.routes.js';

// const router = Router();

// // Unprotected route
// router.post('/login', login);
// // console.log("🚀 ~ router ~ router:", router);

// // Protected routes
// router.use(verifyJWT(['Admin']));

// // Placeholder protected route
// router.post("/refresh", refreshAccessTokenController);
// // Protected route: Only Admin can access
// router.get('/profile', getAdminProfile);
// router.get("/me", getCurrentUserController);
// router.use("/productVendor",productVendorListRoutes);
// router.use("/api/serviceProvider",serviceProviderRoutes);
// router.use('/api/category', categoryRoutes);
// router.use('/api/adminCategory', adminCategoryRoutes);
// router.use('/api/services', serviceRoutes);
// router.use('/api/products', productRoutes);
// router.use("/api/serviceOrder",serviceOrderRoutes);
// router.use("/api/productOrder",productOrderRoutes);
// router.use("/stock",stockRoutes);
// // Route to get the list of all service providers.
// // It requires JWT validation to ensure only authorized users can access it.

// // Update service
// router.put("/services/:serviceId",uploadServiceImage,
//      attachFileToBody("image"),
//     updateServiceController);

// // Delete service
// router.delete("/services/:serviceId", deleteServiceController);

// //update product
// router.put("/products/:productId", upload.single("image"),attachFileToBody("image"), updateProductController);

// // Delete service
// router.delete("/products/:productId", deleteProductController);

// export default router;

// admin.routes.js

// admin.routes.js
// import { Router } from 'express';
// import { attachFileToBody } from "../middlewares/attachFileToBody.js";
// import { verifyJWT } from '../middlewares/authMiddleware.js';
// import { login, getAdminProfile, getCurrentUserController, refreshAccessTokenController } from '../controllers/admin.controller.js';

// import categoryRoutes from "./category.routes.js";
// import adminCategoryRoutes from "./adminCategory.routes.js";
// import serviceRoutes from "./service.routes.js";
// import productRoutes from "./product.routes.js";
// import serviceProviderRoutes from "./serviceProvider.routes.js";
// import productVendorListRoutes from "./productVendor.routes.js";
// import serviceOrderRoutes from "./serviceOrder.routes.js";
// import productOrderRoutes from "./productOrder.routes.js";
// import stockRoutes from './stock.routes.js';

// import { updateServiceController, deleteServiceController } from '../controllers/service.controller.js';
// import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
// import upload from '../middlewares/uploadProduct.js';
// import { updateProductController, deleteProductController } from '../controllers/product.controller.js';

// const router = Router();

// // Unprotected login
// router.post('/login', login);

// // Protected routes (Admin only)
// router.use(verifyJWT(['Admin']));

// // Refresh token
// router.post("/refresh", refreshAccessTokenController);

// // Admin profile
// router.get('/profile', getAdminProfile);
// router.get("/me", getCurrentUserController);

// // Sub-routes
// router.use("/api/productVendor", productVendorListRoutes);
// router.use("/api/serviceProvider", serviceProviderRoutes);
// router.use('/api/category', categoryRoutes);
// router.use('/api/adminCategory', adminCategoryRoutes);
// router.use('/api/services', serviceRoutes);
// router.use('/api/products', productRoutes);

// router.use("/api/serviceOrder", serviceOrderRoutes);
// router.use("/api/productOrder", productOrderRoutes);
// router.use("/api/stock", stockRoutes);

// // Update/Delete routes
// router.put("/services/:serviceId", uploadServiceImage, attachFileToBody("image"), updateServiceController);
// router.delete("/services/:serviceId", deleteServiceController);

// router.put("/products/:productId", upload.single("image"), attachFileToBody("image"), updateProductController);
// router.delete("/products/:productId", deleteProductController);

// export default router;


import { Router } from "express";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

/* ----------------------
   CONTROLLERS
---------------------- */
import {
  login,
  getAdminProfile,
  getCurrentUserController,
  refreshAccessTokenController,
} from "../controllers/admin.controller.js";

import {
  updateServiceController,
  deleteServiceController,
} from "../controllers/service.controller.js";

import {
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

/* ----------------------
   ROUTES IMPORT
---------------------- */
import featuredServiceRoutes from "./featuredService.routes.js";
import featuredProductRoutes from "./featuredProduct.routes.js";
import categoryRoutes from "./category.routes.js";
import adminCategoryRoutes from "./adminCategory.routes.js";
import serviceRoutes from "./service.routes.js";
import productRoutes from "./product.routes.js";
import serviceProviderRoutes from "./serviceProvider.routes.js";
import productVendorListRoutes from "./productVendor.routes.js";
import serviceOrderRoutes from "./serviceOrder.routes.js";
import productOrderRoutes from "./productOrder.routes.js";
import stockRoutes from "./stock.routes.js";
import adminUserProductsRoutes from "./adminUserProducts.routes.js";

/* ----------------------
   MIDDLEWARES
---------------------- */
import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
import upload from "../middlewares/uploadProduct.js";
import { uploadAdminImage } from "../middlewares/uploadAdmin.js";



/* ----------------------
   SERVICES & UTILS
---------------------- */
import { updateAdminService } from "../services/admin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

/* ----------------------
   PUBLIC ROUTES
---------------------- */
router.post("/login", login);

/* ----------------------
   AUTHENTICATED ROUTES
---------------------- */
router.use(verifyJWT(["Admin"])); // ← User + Admin OK

/* ----- Tokens ----- */
router.post("/refresh", refreshAccessTokenController);

/* ----- Admin Profile (Admin Only) ----- */
router.get("/profile", isAdmin, getAdminProfile);

router.put(
  "/profile/update",
  isAdmin,
  uploadAdminImage,
  attachFileToBody("profileImage"),
  asyncHandler(async (req, res) => {
    const adminId = req.user._id;

    const updateData = {
      ...req.body,
      profileImage: req.body.profileImage,
    };

    const updatedAdmin = await updateAdminService(adminId, updateData);

    return res.json(
      new ApiResponse(200, updatedAdmin, "Admin updated successfully")
    );
  })
);

router.get("/me", getCurrentUserController);

/* ----------------------
   USER + ADMIN ROUTES
---------------------- */
router.use("/api/featured-services", featuredServiceRoutes);
router.use("/api/featured-products", featuredProductRoutes);

/* ----------------------
   ADMIN ONLY SUB-ROUTES
---------------------- */
router.use("/api/productVendor", isAdmin, productVendorListRoutes);
router.use("/api/serviceProvider", isAdmin, serviceProviderRoutes);
router.use("/api/category", isAdmin, categoryRoutes);
router.use("/api/adminCategory", isAdmin, adminCategoryRoutes);
router.use("/api/services", isAdmin, serviceRoutes);
router.use("/api/products", isAdmin, productRoutes);
router.use("/api/serviceOrder", isAdmin, serviceOrderRoutes);
router.use("/api/productOrder", isAdmin, productOrderRoutes);
router.use("/api/stock", isAdmin, stockRoutes);
router.use("/api/user-products", adminUserProductsRoutes);

/* ----------------------
   ADMIN UPDATE/DELETE
---------------------- */
router.put(
  "/services/:serviceId",
  isAdmin,
  uploadServiceImage,
  attachFileToBody("image"),
  updateServiceController
);

router.delete("/services/:serviceId", isAdmin, deleteServiceController);

router.put(
  "/products/:productId",
  isAdmin,
  upload.single("image"),
  attachFileToBody("image"),
  updateProductController
);

router.delete("/products/:productId", isAdmin, deleteProductController);

export default router;
