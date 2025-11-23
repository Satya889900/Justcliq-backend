// validations/bookedService.validation.js
import Joi from "joi";

// Create booking
export const bookServiceSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required(), // MongoDB ObjectId
  bookedDate: Joi.date().iso().required(), // ISO date
  bookedTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm (24-hour)
    .required(),
});

// Get bookings for a specific service
export const getBookedServicesByUserAndServiceSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required(),
});

// Get all bookings for a user (optional filter by status, date)
export const getUserBookingsSchema = Joi.object({
  status: Joi.string().valid("completed", "upcoming").optional(),
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
});

// Completed bookings — optional date filters
export const getCompletedBookedServicesSchema = Joi.object({
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
});

// Upcoming bookings — optional date filters
export const getUpcomingBookedServicesSchema = Joi.object({
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
});
