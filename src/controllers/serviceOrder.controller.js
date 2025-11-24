// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import * as service from "../services/serviceOrder.service.js";
// import { validate } from "../middlewares/validate.js";
// import {
//   updateBookedServiceSchema,
//   assignVendorSchema,
// } from "../validations/serviceOrder.validator.js";

// import Joi from "joi";

// // Controller: get all bookings
// export const getAllBookedServicesController = asyncHandler(async (req, res) => {
//   const bookings = await service.viewAllBookedServices();
//   res.json(
//     new ApiResponse(200, bookings, "All booked services fetched successfully")
//   );
// });

// // Controller: get single booking
// export const getBookedServiceByIdController = [
//   validate(
//     Joi.object({ bookingId: Joi.string().hex().length(24).required() }),
//     "params"
//   ),
//   asyncHandler(async (req, res) => {
//     const { bookingId } = req.params;
//     const booking = await service.viewBookedServiceById(bookingId);
//     res.json(
//       new ApiResponse(200, booking, "Booked service fetched successfully")
//     );
//   }),
// ];

// // POST /admin/api/serviceOrder/assign-vendor
// export const assignVendorController = [
//   validate(assignVendorSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const { bookingId, vendorId } = req.validatedBody;
//     const adminId = req.user._id; // Admin assigning the vendor

//     const updatedBooking = await service.assignVendorToBookingService(
//       bookingId,
//       vendorId,
//       adminId
//     );

//     res.json(
//       new ApiResponse(200, updatedBooking, "Vendor/Admin assigned successfully")
//     );
//   }),
// ];

// // Controller to update status
// export const updateBookedServiceStatusController = [
//   validate(updateBookedServiceSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const { bookingId, status } = req.validatedBody;
//     const currentUser = req.user; // assuming auth middleware sets req.user

//     const updatedBooking = await service.updateBookedServiceStatus(
//       bookingId,
//       status,
//       currentUser
//     );

//     res.json(
//       new ApiResponse(
//         200,
//         updatedBooking,
//         "Booked service updated successfully"
//       )
//     );
//   }),
// ];

// // Vendor accepts
// export const vendorAcceptController = asyncHandler(async (req, res) => {
//   const { bookingId } = req.body;
//   const vendorId = req.user._id;
//   const booking = await service.vendorAcceptBooking(bookingId, vendorId);
//   res.json(
//     new ApiResponse(
//       200,
//       booking,
//       "Booking accepted, status updated to Scheduled"
//     )
//   );
// });

// // Vendor rejects
// export const vendorRejectController = asyncHandler(async (req, res) => {
//   const { bookingId } = req.body;
//   const vendorId = req.user._id;
//   const booking = await service.vendorRejectBooking(bookingId, vendorId);
//   res.json(
//     new ApiResponse(
//       200,
//       booking,
//       "Booking rejected, status updated to Cancelled"
//     )
//   );
// });

// // User completes booking
// export const completeBookingController = asyncHandler(async (req, res) => {
//   const { bookingId } = req.body;
//   const booking = await service.completeBookingByUser(bookingId);
//   res.json(
//     new ApiResponse(
//       200,
//       booking,
//       "Booking completed successfully, status updated to Completed"
//     )
//   );
// });

// export const getBookingsController = asyncHandler(async (req, res) => {
//   const bookings = await service.getBookingsService();
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, bookings, "All booked services fetched successfully")
//     );
// });



// controllers/serviceOrder.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as service from "../services/serviceOrder.service.js";
import { validate } from "../middlewares/validate.js";
import {
  updateBookedServiceSchema,
  assignVendorSchema,
} from "../validations/serviceOrder.validator.js";

import ServiceOrder from "../models/serviceOrder.model.js"; 
import Joi from "joi";

// GET all bookings (Admin view)
export const getAllBookedServicesController = asyncHandler(async (req, res) => {
  const bookings = await service.viewAllBookedServices();
  res.json(
    new ApiResponse(200, bookings, "All booked services fetched successfully")
  );
});

// GET single booking by id
export const getBookedServiceByIdController = [
  validate(
    Joi.object({ bookingId: Joi.string().hex().length(24).required() }),
    "params"
  ),
  asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await service.viewBookedServiceById(bookingId);
    res.json(
      new ApiResponse(200, booking, "Booked service fetched successfully")
    );
  }),
];

// POST /admin/api/serviceOrder/assign-vendor
export const assignVendorController = [
  validate(assignVendorSchema, "body"),
  asyncHandler(async (req, res) => {

    const { bookingId, vendorId } = req.validatedBody;

    const adminId = req.user._id;

    const updatedBooking = await service.assignVendorToBookingService(
      bookingId,
      vendorId,
      adminId
    );

    res.json(
      new ApiResponse(200, updatedBooking, "Vendor/Admin assigned successfully")
    );
  })
];

export const getOngoingOrdersController = asyncHandler(async (req, res) => {
  const ongoing = await ServiceOrder.find({
    status: { $in: ["Assigned", "In-progress"] }
  })
  .lean();

  return res.status(200).json(
    new ApiResponse(200, ongoing, "Ongoing service orders fetched successfully")
  );
});
export const assignVendorToServiceOrderController = asyncHandler(async (req, res) => {
  const { bookingId, vendorId } = req.body;

  if (!bookingId || !vendorId) {
    throw new ApiError(400, "bookingId and vendorId are required");
  }

  // find and update booking
  const updatedOrder = await ServiceOrder.findByIdAndUpdate(
    bookingId,
    { assignedVendor: vendorId, status: "Assigned" },
    { new: true }
  );

  if (!updatedOrder) throw new ApiError(404, "Service order not found");

  return res.status(200).json(
    new ApiResponse(200, updatedOrder, "Vendor assigned successfully")
  );
});



// PATCH /admin/api/serviceOrder/update-status
export const updateBookedServiceStatusController = [
  validate(updateBookedServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const { bookingId, status } = req.validatedBody;
    const currentUser = req.user;

    const updatedBooking = await service.updateBookedServiceStatus(
      bookingId,
      status,
      currentUser
    );

    res.json(
      new ApiResponse(
        200,
        updatedBooking,
        "Booked service updated successfully"
      )
    );
  }),
];

// POST /admin/api/serviceOrder/accept
export const vendorAcceptController = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const { _id: userId, userType } = req.user;

  const booking = await service.vendorAcceptBooking(
    bookingId,
    userId.toString(),
    userType
  );

  res.json(
    new ApiResponse(
      200,
      booking,
      "Booking accepted, status updated to Scheduled"
    )
  );
});

// POST /admin/api/serviceOrder/reject
export const vendorRejectController = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const { _id: userId, userType } = req.user;

  const booking = await service.vendorRejectBooking(
    bookingId,
    userId.toString(),
    userType
  );

  res.json(
    new ApiResponse(
      200,
      booking,
      "Booking rejected, status updated to Cancelled"
    )
  );
});
export const getUpcomingOrdersController = asyncHandler(async (req, res) => {
  const upcoming = await ServiceOrder.find({
    status: "Upcoming"
  }).lean();

  return res.status(200).json(
    new ApiResponse(200, upcoming, "Upcoming booked services fetched successfully")
  );
});


// POST /admin/api/serviceOrder/complete
export const completeBookingController = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const { _id: userId, userType } = req.user;

  // ❌ Admin must NOT be allowed
  if (userType === "Admin") {
    return res.status(403).json({
      success: false,
      message: "Admin is not allowed to complete the booking",
    });
  }

  const booking = await service.completeBookingByUserOrVendor(
    bookingId,
    userId,
    userType
  );

  return res.json(
    new ApiResponse(
      200,
      booking,
      "Booking marked as Completed successfully"
    )
  );
});


// GET /admin/api/serviceOrder/serviceOrder (custom listing)
export const getBookingsController = asyncHandler(async (req, res) => {
  const bookings = await service.getBookingsService();
  return res
    .status(200)
    .json(
      new ApiResponse(200, bookings, "All booked services fetched successfully")
    );
});
