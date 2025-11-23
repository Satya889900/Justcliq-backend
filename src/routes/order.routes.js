// routes/user/order.routes.js
import express from "express";
import { getOrderedProductsByTimeController,placeOrderController } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();



// POST: Place a new order
router.post("/orders",  placeOrderController);

router.get("/orders/products",  getOrderedProductsByTimeController);

export default router;
