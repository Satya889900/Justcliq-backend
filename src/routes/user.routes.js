// /*user.routes.js*/

// import { Router } from 'express';
// import { verifyJWT } from '../middlewares/authMiddleware.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// import { register,requestOtp, login, getProfile, updateProfile } from '../controllers/user.controller.js';
// import { upload } from "../middlewares/uploadMiddleware.js";
// import categoryRoutes from "./category.routes.js";
// import serviceRoutes from "./service.routes.js";
// import productRoutes from "./product.routes.js";
// import bookingRoutes from "./bookedService.routes.js";
// import orderRoutes from "./order.routes.js";
// import {
//   updateBookedServiceStatusController,
// } from "../controllers/serviceOrder.controller.js";
// import cartRoutes from "./cart.routes.js";
// import { register, requestOtp, login, getProfile, updateProfile, deleteUserAccount } 
// from "../controllers/user.controller.js";
// const router = Router();

// // Unprotected route

// // Registration route
// router.post('/register', register);
// // OTP login flow
// router.post('/request-otp', requestOtp);
// router.post('/login', login);

// // Protected routes
// // Protected routes
// router.use(verifyJWT(['User', 'Admin']));

// router.get("/profile", getProfile);


// // NEW — Update User Account
// router.put("/update", upload.single("profileImage"), updateProfile);

// // NEW — Delete User Account
// router.delete("/delete", deleteUserAccount);


// //service categories
// // JWT-protected route for users
// router.use('/api/services', serviceRoutes);
// router.use('/api/categories', categoryRoutes);
// router.put("/profile",upload.single("profileImage"), updateProfile);

// router.use('/api/products', productRoutes);
// router.use('/api/bookings', bookingRoutes);
// router.use('/api/orders', orderRoutes);
// router.use('/cart',cartRoutes);

// // Only authenticated users can update
// router.patch("/update-status",  updateBookedServiceStatusController);

// // Placeholder protected route
// router.get('/dashboard', asyncHandler(async (req, res) => {
//   return res.json(new ApiResponse(200, {}, 'User dashboard accessed'));
// }));

// export default router;


// import { Router } from "express";
// import { verifyJWT } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/uploadMiddleware.js";

// import featuredServiceRoutes from "./featuredService.routes.js";
// import featuredProductRoutes from "./featuredProduct.routes.js";
// import {
//   register,
//   requestOtp,
//   login,
//   getProfile,
//   updateProfile,
//   deleteUserAccount
// } from "../controllers/user.controller.js";

// import categoryRoutes from "./category.routes.js";
// import serviceRoutes from "./service.routes.js";
// import productRoutes from "./product.routes.js";
// import bookingRoutes from "./bookedService.routes.js";
// import orderRoutes from "./order.routes.js";
// import cartRoutes from "./cart.routes.js";

// import { updateBookedServiceStatusController } from "../controllers/serviceOrder.controller.js";

// const router = Router();

// // Public Routes
// router.post("/register", register);
// router.post("/request-otp", requestOtp);
// router.post("/login", login);

// // Protected Routes
// router.use(verifyJWT(["User", "Admin"]));

// // Get profile
// router.get("/profile", getProfile);

// // Update user profile
// router.put("/profile", upload.single("profileImage"), updateProfile);

// // Update full account
// router.put("/update", upload.single("profileImage"), updateProfile);

// // Delete account
// router.delete("/delete", deleteUserAccount);

// // User modules
// router.use("/api/services", serviceRoutes);
// router.use("/api/categories", categoryRoutes);
// router.use("/api/products", productRoutes);
// router.use("/api/bookings", bookingRoutes);
// router.use("/api/orders", orderRoutes);
// router.use("/cart", cartRoutes);
// router.use("/api/featured-services", featuredServiceRoutes);
// router.use("/api/featured-products", featuredProductRoutes);

// // Update booking status
// router.patch("/update-status", updateBookedServiceStatusController);

// export default router;


// user.routes.js
// user.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

import {
  register,
  requestOtp,
  login,
  getProfile,
  updateProfile,
  deleteUserAccount,
  saveRequestUser
} from "../controllers/user.controller.js";

import categoryRoutes from "./category.routes.js";
import serviceRoutes from "./service.routes.js";
import productRoutes from "./product.routes.js";
import bookingRoutes from "./bookedService.routes.js";
import orderRoutes from "./order.routes.js";
import cartRoutes from "./cart.routes.js";
import vendorOrderRoutes from "../routes/vendorOrder.routes.js";
import featuredServiceRoutes from "./featuredService.routes.js";
import featuredProductRoutes from "./featuredProduct.routes.js";
import { updateBookedServiceStatusController } from "../controllers/serviceOrder.controller.js";
import serviceProviderRoutes from "./serviceProvider.routes.js";
const router = Router();

/* ============================
   PUBLIC ROUTES (NO TOKEN)
=============================== */

router.post("/register", register);
router.post("/request-otp", requestOtp);
router.post("/login", login);

// ⭐ Save User Directly (Your Requirement)
router.post("/request", saveRequestUser);

/* ============================
   PROTECTED ROUTES (TOKEN REQUIRED)
=============================== */

router.use(verifyJWT(["User", "Admin"]));

router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);
router.put("/update", upload.single("profileImage"), updateProfile);
router.delete("/delete", deleteUserAccount);

/* ============================
   USER MODULE ROUTES
=============================== */

router.use("/api/services", serviceRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/products", productRoutes);
router.use("/api/bookings", bookingRoutes);
router.use("/api/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/api/featured-services", featuredServiceRoutes);
router.use("/api/featured-products", featuredProductRoutes);
router.use("/service-provider", serviceProviderRoutes);

router.use("/vendor/api/orders", verifyJWT(["User"]), vendorOrderRoutes);
router.use(verifyJWT(["User", "Admin"]));
router.patch("/update-status", updateBookedServiceStatusController);

router.patch("/update-status", updateBookedServiceStatusController);

export default router;
