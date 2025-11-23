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
export const getUserBookedServices = [
  validate(getUserBookingsSchema, "query"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const filters = req.query;

    const bookings = await getUserBookings(userId, filters);

    return res.json(
      new ApiResponse(200, bookings, "Booked services fetched successfully")
    );
  }),
];

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
