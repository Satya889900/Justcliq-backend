import express from "express";
import { getOrdersController,
    getProductPosterController,
    assignVendorController,
    markAsDeliveredController,
    cancelOrderController
 } from "../controllers/productOrder.controller.js";


const router = express.Router();

router.post("/product-poster", getProductPosterController);

router.patch("/orders/:orderId/assign-vendor",
     assignVendorController);

// Mark as Delivered after feedback
router.patch("/:orderId/feedback", markAsDeliveredController);

// Cancel order
router.patch("/:orderId/cancel", cancelOrderController);

router.get("/orders", getOrdersController);

export default router;
