// // import { Router } from "express";
// // import {
// //   getAllBookedServicesController,
// //   getBookedServiceByIdController,
// //   assignVendorController,
// //   updateBookedServiceStatusController,
// //   vendorAcceptController,
// //   vendorRejectController,
// //   completeBookingController,
// //   getBookingsController,
// // } from "../controllers/serviceOrder.controller.js";

// // const router = Router();

// // // All routes require authentication

// // // Admin routes
// // router.get("/", getAllBookedServicesController);
// // router.get("/:bookingId", getBookedServiceByIdController);
// // router.post("/assign-vendor", assignVendorController);
// // router.patch("/update-status", updateBookedServiceStatusController);

// // // Vendor actions
// // router.post("/accept", vendorAcceptController);
// // router.post("/reject", vendorRejectController);

// // // User completes booking
// // router.post("/complete", completeBookingController);

// // // router.get("/serviceOrder", getBookingsController);

// // export default router;

// // serviceOrder.routes.js
// import { Router } from "express";
// import {
//   getAllBookedServicesController,
//   getBookedServiceByIdController,
//   assignVendorController,
//   updateBookedServiceStatusController,
//   vendorAcceptController,
//   vendorRejectController,
//   completeBookingController,
//   getUpcomingOrdersController,
//   getBookingsController,
//   // assignVendorToServiceOrderController,
//   getOngoingOrdersController,
// } from "../controllers/serviceOrder.controller.js";
// import { verifyJWT } from "../middlewares/authMiddleware.js";

// import { validate } from "../middlewares/validate.js";
// import { assignVendorSchema } from "../validations/serviceOrder.validator.js";


// const router = Router();

// // Vendor first
// router.post("/accept", vendorAcceptController);
// router.post("/reject", vendorRejectController);

// router.post(
//   "/complete",
//   verifyJWT(["User"]),    // vendor also has userType "User"
//   completeBookingController
// );

// // Admin
// // router.get("/", getAllBookedServicesController);
// // router.post(
// //   "/assign-vendor",
// //   validate(assignVendorSchema, "body"),
// //   assignVendorController[1]         // The async handler function
// // );

// router.patch("/update-status", verifyJWT(["Admin"]), updateBookedServiceStatusController);


// // LAST

// router.post(
//   "/assign-vendor",
//   verifyJWT(["Admin"]),
//   validate(assignVendorSchema, "body"),
//   assignVendorController[1]
// );
// router.get("/ongoing", verifyJWT(["Admin"]), getOngoingOrdersController);
// router.get("/upcoming", verifyJWT(["Admin"]), getUpcomingOrdersController);
// router.get("/", getAllBookedServicesController);
// router.get("/:bookingId", getBookedServiceByIdController);


// router.get("/serviceOrder", getBookingsController);
// export default router;


// serviceOrder.routes.js
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
  verifyJWT(["Admin"]),
  validate(assignVendorSchema, "body"),
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
