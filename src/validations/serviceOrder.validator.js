import Joi from "joi";
import JoiObjectId from "joi-objectid";

Joi.ObjectId = JoiObjectId(Joi);

export const updateBookedServiceSchema = Joi.object({
  bookingId: Joi.ObjectId().required(),
  status: Joi.string()
    .valid("Upcoming", "Scheduled", "Ongoing", "Completed", "Cancelled")
    .required(),
});


// Validate assignment of vendor to a booked service

// Joi schema for assigning vendor
export const assignVendorSchema = Joi.object({
  bookingId: Joi.string().hex().length(24).required(),
  vendorId: Joi.string().hex().length(24).required(),
});