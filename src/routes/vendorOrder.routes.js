import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import BookedService from "../models/bookedService.model.js";
import { vendorAcceptController, vendorRejectController } from "../controllers/serviceOrder.controller.js";

const router = Router();

/* ================================
   GET All Orders Assigned to Vendor
=================================== */
router.get("/my-orders", verifyJWT(["User"]), async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await BookedService.find({ vendor: vendorId })
      .populate("service")
      .populate("user")
      .lean();

    res.json({
      success: true,
      message: "Vendor orders fetched",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================================
    Vendor Accept Booking
=================================== */
router.post("/accept", verifyJWT(["User"]), vendorAcceptController);

/* ================================
    Vendor Reject Booking
=================================== */
router.post("/reject", verifyJWT(["User"]), vendorRejectController);

/* ================================
    Upcoming orders
=================================== */
router.get("/upcoming", verifyJWT(["User"]), async (req, res) => {
  const vendorId = req.user._id;

  const orders = await BookedService.find({
    vendor: vendorId,
    status: "Upcoming",
  });

  res.json({
    success: true,
    message: "Upcoming orders",
    data: orders,
  });
});
  
/*SCHEDULED ORDERS (Vendor accepted but not started)
======================================================== */
router.get("/scheduled", verifyJWT(["User"]), async (req, res) => {
  const vendorId = req.user._id;

  const orders = await BookedService.find({
    vendor: vendorId,
    status: "Scheduled",
  });

  res.json({
    success: true,
    message: "Scheduled orders",
    data: orders,
  });
});
/* ================================
    Ongoing orders
=================================== */
router.get("/ongoing", verifyJWT(["User"]), async (req, res) => {
  const vendorId = req.user._id;

  const orders = await BookedService.find({
    vendor: vendorId,
    status: "Ongoing",
  });

  res.json({
    success: true,
    message: "Ongoing orders",
    data: orders,
  });
});

export default router;
