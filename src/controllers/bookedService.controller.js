import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  bookServiceForUser,
  fetchBookedServicesByUserAndServiceService,
  getUserBookings,
  getCompletedBookedServices,
  getUpcomingBookedServices as getUpcomingBookedServicesService,
} from "../services/bookedService.service.js";
import { validate } from "../middlewares/validate.js";
import {
  bookServiceSchema,
  getBookedServicesByUserAndServiceSchema,
  getUserBookingsSchema,
  getCompletedBookedServicesSchema,
  getUpcomingBookedServicesSchema,
} from "../validations/bookedService.validation.js";
import BookedService from "../models/bookedService.model.js";
import { cancelBookedService } from "../services/bookedService.service.js";
import { cancelBookingSchema } from "../validations/bookedService.validation.js";
import { startServiceByVendor } from "../services/bookedService.service.js";
// POST create booking
export const bookServiceController = [
  validate(bookServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id; // from JWT
    const { serviceId, bookedDate, bookedTime } = req.body;

    const booking = await bookServiceForUser(userId, serviceId, bookedDate, bookedTime);

    return res
      .status(201)
      .json(new ApiResponse(201, booking, "Service booked successfully"));
  }),
];

// For specific service
export const getBookedServicesByUserAndServiceController = [
  validate(getBookedServicesByUserAndServiceSchema, "params"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { serviceId } = req.params;

    const bookedServices = await fetchBookedServicesByUserAndServiceService(
      userId,
      serviceId
    );

    return res.json(
      new ApiResponse(200, bookedServices, "Booked services fetched successfully")
    );
  }),
];

// All bookings (with optional filters)
export const getUserBookedServices = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all bookings sorted by last update
  const allBookings = await BookedService.find({ user: userId })
    .populate("service", "name cost image category description")
    .populate("vendor", "firstName lastName phone email profileImage")
    .sort({ updatedAt: -1 });  // ⭐ ALWAYS SHOW MOST RECENT STATUS

  // Remove duplicates → keep only latest booking per service
  const uniqueBookings = Object.values(
    allBookings.reduce((acc, booking) => {
      acc[booking.service._id] = booking; // overwrite older ones
      return acc;
    }, {})
  );

  return res.status(200).json(
    new ApiResponse(200, uniqueBookings, "Booked services fetched successfully")
  );
});



// Completed bookings (with optional filters)
export const getCompletedBookedServicesController = [
  validate(getCompletedBookedServicesSchema, "query"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const filters = req.query;

    const services = await getCompletedBookedServices(userId, filters);

    return res.json(
      new ApiResponse(200, services, "Completed booked services fetched successfully")
    );
  }),
];

// Upcoming bookings (with optional filters)
export const getUpcomingBookedServicesController = [
  validate(getUpcomingBookedServicesSchema, "query"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const filters = req.query;

    const services = await getUpcomingBookedServicesService(userId, filters);

    return res.json(
      new ApiResponse(200, services, "Upcoming booked services fetched successfully")
    );
  }),
];



export const startServiceByVendorController = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { bookingId } = req.params;

  const booking = await startServiceByVendor(vendorId, bookingId);

  return res.status(200).json(
    new ApiResponse(200, booking, "Service started successfully")
  );
});

export const cancelBookedServiceController = [
  validate(cancelBookingSchema, "params"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { bookingId } = req.params;
    const { reason } = req.body;   // ⭐ GET CANCEL REASON

    const result = await cancelBookedService(userId, bookingId, reason);

    return res.status(200).json(
      new ApiResponse(200, result, "Service booking cancelled successfully")
    );
  }),
];

