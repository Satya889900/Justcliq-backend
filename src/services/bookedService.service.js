

import { ApiError } from "../utils/ApiError.js";
import { createBookedService, getBookedServicesByUserAndService,getBookedServicesByUser as getUserBookingsRepo,getCompletedBookedServicesByUser,getUpcomingBookedServicesByUser } from "../repository/bookedService.repository.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";


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