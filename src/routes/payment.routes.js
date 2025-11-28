import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
// import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.use(verifyJWT); // protect all routes

router.post("/create-order", (req, res, next) => {
  console.log("📝 /create-order route called:", req.method, req.originalUrl);
  next();
}, createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
