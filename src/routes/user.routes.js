
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
  saveRequestUser,
  logoutUser
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
import userProductRoutes from "./userProduct.routes.js";
import paymentRoutes from "./payment.routes.js";

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

router.use(verifyJWT(["User", "Admin", "ServiceProvider"]));

router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);
router.put("/update", upload.single("profileImage"), updateProfile);
router.delete("/delete", deleteUserAccount);
router.post("/logout", logoutUser);

/* ============================
   USER MODULE ROUTES
=============================== */

router.use("/api/services", serviceRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/products", productRoutes);      // Admin or main product routes
router.use("/api/user-products", userProductRoutes);
router.use("/api/bookings", bookingRoutes);
router.use("/api/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/api/featured-services", featuredServiceRoutes);
router.use("/api/featured-products", featuredProductRoutes);
router.use("/service-provider", serviceProviderRoutes);


router.use("/vendor/api/orders", verifyJWT(["User"]), vendorOrderRoutes);
// router.use(verifyJWT(["User"])); // This was causing the error by re-validating and blocking Admins
router.patch("/update-status", updateBookedServiceStatusController);

router.use("/payment", (req, res, next) => {
  console.log("💳 Payment route called:", req.method, req.originalUrl);
  next();
}, paymentRoutes);



export default router;
