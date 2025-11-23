

import BookedService from "../models/bookedService.model.js";
import User from "../models/user.model.js";



// Create a new booking
// ✅ Create booking with vendor explicitly set
export const createBookedService = async ({ service, user, vendor, bookedDate, bookedTime }) => {
  return await BookedService.create({
    service,
    user,
    vendor,
    bookedDate,
    bookedTime,
  });
};


// Fetch a booked service with vendor info
export const getBookedServiceWithVendor = async (bookingId) => {
  return await BookedService.findById(bookingId)
    .populate({
      path: "service",
      select: "name cost image category", // ✅ description excluded
    })
    .populate("vendor", "firstName lastName phone email") // Vendor details
    .populate("user", "firstName lastName phone email"); // Customer details
};

// Find default vendor (Mohan) if no vendor assigned to service
export const getDefaultVendor = async () => {
  const vendor = await User.findOne({ firstName: "Mohan" });
  if (!vendor) {
    throw new Error("Default vendor 'Mohan' not found in the database");
  }
  return vendor;
};

// Fetch booked services for a specific user and service
export const getBookedServicesByUserAndService = async (userId, serviceId) => {
  return await BookedService.find({ user: userId, service: serviceId })
    .populate("service", "name cost image category") // exclude description
    .populate("vendor", "firstName lastName phone email"); // include vendor details
};

// Fetch booked services for a user, populate service name/cost/image and vendor details (name, phone, email)
// repository/bookedService.repository.js
// ✅ Fetch all bookings of a user
export const getBookedServicesByUser = async (userId) => {
  return await BookedService.find({ user: userId })
    .populate({
      path: "service",
      select: "name cost image category", // description excluded
    })
    .populate("vendor", "firstName lastName phone email") // Vendor details
    .sort({ bookedDate: -1, bookedTime: 1 });
};


// Get completed booked services for a user
// Get completed booked services for a user
export const getCompletedBookedServicesByUser = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today, to exclude today’s bookings

  return await BookedService.find({
    user: userId,
    bookedDate: { $lt: today }, // use correct field name
  })
    .populate({
      path: "service",
      select: "name cost image category", // description excluded
    })
    .populate("vendor", "firstName lastName phone email") // Vendor details
    .sort({ bookedDate: -1, bookedTime: 1 }); // latest first
};


// Get upcoming booked services for a user (today and future)
export const getUpcomingBookedServicesByUser = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  return await BookedService.find({
    user: userId,
    bookedDate: { $gte: today }, // today and future
  })
    .populate({
      path: "service",
      select: "name cost image category", // include service info
    })
    .populate("vendor", "firstName lastName phone email") // vendor info
    .sort({ bookedDate: 1, bookedTime: 1 }); // earliest first
};