// routes/user/order.routes.js
import express from "express";
import { getOrderedProductsByTimeController,placeOrderController } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getUserOrders } from "../controllers/order.controller.js";
import { getSingleOrderController,cancelUserOrderController } from "../controllers/order.controller.js";
const router = express.Router();


router.get("/my-orders", getUserOrders);
// POST: Place a new order
// Place a new manual order (rarely used now)
router.post("/", placeOrderController);
router.patch("/cancel/:orderId", verifyJWT(["User"]), cancelUserOrderController);


router.get("/orders/products",  getOrderedProductsByTimeController);

router.get("/:orderId", getSingleOrderController);

export default router;
