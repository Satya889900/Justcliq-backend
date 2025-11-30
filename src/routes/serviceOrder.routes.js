import { Router } from "express";

import {
  getAllBookedServicesController,
  getBookedServiceByIdController,
  assignVendorController,
  updateBookedServiceStatusController,
  vendorAcceptController,
  vendorRejectController,
  completeBookingController,
  getUpcomingOrdersController,
  getOngoingOrdersController,
  getBookingsController
} from "../controllers/serviceOrder.controller.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { assignVendorSchema } from "../validations/serviceOrder.validator.js";

const router = Router();

/* ======================================================
   🔐 VENDOR ACTIONS (ACCEPT / REJECT)
====================================================== */
router.post("/accept", verifyJWT(["User"]), vendorAcceptController);
router.post("/reject", verifyJWT(["User"]), vendorRejectController);

/* ======================================================
   🔐 USER / VENDOR COMPLETE BOOKING
   (your vendors are also stored in User model)
====================================================== */
router.post("/complete", verifyJWT(["User"]), completeBookingController);

/* ======================================================
   🔐 ADMIN: UPDATE STATUS OF ANY BOOKING
====================================================== */
router.patch("/update-status", verifyJWT(["Admin"]), updateBookedServiceStatusController);

/* ======================================================
   🔐 ADMIN: ASSIGN VENDOR
====================================================== */
router.post(
  "/assign-vendor",
//   verifyJWT(["Admin"]),
//   validate(assignVendorSchema, "body"),
  assignVendorController[1]
);

/* ======================================================
   🔐 ADMIN: LISTINGS
====================================================== */
router.get("/ongoing", verifyJWT(["Admin"]), getOngoingOrdersController);
router.get("/upcoming", verifyJWT(["Admin"]), getUpcomingOrdersController);

router.get("/serviceOrder", verifyJWT(["Admin"]), getBookingsController);

/* ======================================================
   🔐 ADMIN: GET ALL BOOKINGS + SINGLE BOOKING
====================================================== */
router.get("/", verifyJWT(["Admin"]), getAllBookedServicesController);
router.get("/:bookingId", verifyJWT(["Admin"]), getBookedServiceByIdController);

export default router;
