

// import { Router } from "express";
// import {bookServiceController , getBookedServicesByUserAndServiceController, getUserBookedServices,getCompletedBookedServicesController,getUpcomingBookedServicesController } from "../controllers/bookedService.controller.js";
// import { verifyJWT } from "../middlewares/authMiddleware.js";

// const router = Router();

// // 🔐 Protect all booking routes
// router.use(verifyJWT(["User", "Admin"]));



// // JWT-protected route: book a service
// router.post("/api/bookings",  bookServiceController);

// // JWT-protected route: get all bookings for a specific service
// router.get("/services/:serviceId/bookings",  getBookedServicesByUserAndServiceController);

// // Protected route, only for User
// router.get('/completed',  getCompletedBookedServicesController);

// // ✅ JWT-protected route for user
// router.get("/booked-services",  getUserBookedServices);

// // Protected route: only User
// router.get('/upcoming',  getUpcomingBookedServicesController);

// export default router;


import { Router } from "express";
import {
  bookServiceController,
  getBookedServicesByUserAndServiceController,
  getUserBookedServices,
  getCompletedBookedServicesController,
  getUpcomingBookedServicesController,
  cancelBookedServiceController,
  startServiceByVendorController
} from "../controllers/bookedService.controller.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// protect all routes
router.use(verifyJWT(["User", "Admin"]));

/**
 * POST /user/api/bookings
 */
router.post("/", bookServiceController);

/**
 * GET /user/api/bookings
 */
router.get("/", getUserBookedServices);

/**
 * GET /user/api/bookings/upcoming
 */
router.get("/upcoming", getUpcomingBookedServicesController);
router.patch("/start/:bookingId", startServiceByVendorController);

/**
 * GET /user/api/bookings/completed
 */
router.get("/completed", getCompletedBookedServicesController);

/**
 * GET /user/api/bookings/service/:serviceId
 */
router.get("/service/:serviceId", getBookedServicesByUserAndServiceController);
router.patch("/cancel/:bookingId", cancelBookedServiceController); 
export default router;
