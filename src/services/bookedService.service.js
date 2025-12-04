

import { ApiError } from "../utils/ApiError.js";
import { createBookedService, getBookedServicesByUserAndService,getBookedServicesByUser as getUserBookingsRepo,getCompletedBookedServicesByUser,getUpcomingBookedServicesByUser } from "../repository/bookedService.repository.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";

import BookedService from "../models/bookedService.model.js";

export const bookServiceForUser = async (userId, serviceId, bookedDate, bookedTime) => {
  if (!serviceId || !bookedDate || !bookedTime) {
    throw new ApiError(400, "Service ID, booked date, and booked time are required");
  }

  const service = await Service.findById(serviceId).populate("user");

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  let vendor = service.user;

  // If no vendor in service → fallback to Mohan
  if (!vendor) {
    vendor = await User.findOne({ firstName: "Mohan" });
    if (!vendor) {
      throw new ApiError(500, "Default vendor 'Mohan' not found in the database");
    }
  }

  const booking = await createBookedService({
    service: service._id,
    user: userId,
    vendor: vendor._id,
    bookedDate,
    bookedTime,
  });

  return booking.populate([
    { path: "service", select: "name cost image category" },
    { path: "vendor", select: "firstName lastName phone email" },
    { path: "user", select: "firstName lastName phone email" },
  ]);
};

export const fetchBookedServicesByUserAndServiceService = async (userId, serviceId) => {
  if (!serviceId) {
    throw new ApiError(400, "Service ID is required");
  }

  const bookedServices = await getBookedServicesByUserAndService(userId, serviceId);

  if (!bookedServices || bookedServices.length === 0) {
    throw new ApiError(404, "No booked services found for this service");
  }

  return bookedServices;
};

// Fetch booked services for the logged-in user
export const getUserBookings = async (userId) => {
  const bookings = await getUserBookingsRepo(userId);

  if (!bookings || bookings.length === 0) {
    throw new ApiError(404, "No booked services found for this user");
  }

  return bookings;
};


export const getCompletedBookedServices = async (userId) => {
  const services = await getCompletedBookedServicesByUser(userId);
  
  if (!services || services.length === 0) {
    return []; // return empty array if none
  }

  return services;
};

export const getUpcomingBookedServices = async (userId) => {
  const services = await getUpcomingBookedServicesByUser(userId);
  return services || [];
};
export const startServiceByVendor = async (vendorId, bookingId) => {
  const booking = await BookedService.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // vendor check
  if (booking.vendor.toString() !== vendorId.toString()) {
    throw new ApiError(403, "You are not authorized to start this service");
  }

  // can't start completed or cancelled
  if (booking.status === "Completed") {
    throw new ApiError(400, "Completed booking cannot be started");
  }
  if (booking.status === "Cancelled") {
    throw new ApiError(400, "Cancelled booking cannot be started");
  }

  // already started
  if (booking.status === "Ongoing") {
    throw new ApiError(400, "Service is already in progress");
  }

  // update status
  booking.status = "Ongoing";
  await booking.save();

  return await booking.populate([
    { path: "service", select: "name cost image category" },
    { path: "vendor", select: "firstName lastName phone email" },
    { path: "user", select: "firstName lastName phone email" }
  ]);
};


export const cancelBookedService = async (userId, bookingId, reason = "") => {
  const booking = await BookedService.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to cancel this booking");
  }

  if (booking.status === "Completed") {
    throw new ApiError(400, "Completed bookings cannot be cancelled");
  }

  if (booking.status === "Cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  // ✔ Correct cancel logic
  booking.status = "Cancelled";
  booking.cancelReason = reason || "No reason provided";
  booking.userCompleted = false;
  booking.vendorCompleted = false;

  await booking.save();

  return await booking.populate([
    { path: "service", select: "name cost image category" },
    { path: "vendor", select: "firstName lastName phone email" },
    { path: "user", select: "firstName lastName phone email" }
  ]);
};

