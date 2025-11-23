// validations/serviceProvider.validation.js
import Joi from "joi";

// ✅ Rating validation schema
const ratingSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(), // MongoDB ObjectId
  rating: Joi.number().min(1).max(5).required(),
});

// ✅ Create Service Provider
export const createServiceProviderSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  serviceType: Joi.string().min(3).max(100).required(),
  cost: Joi.number().positive().precision(2).required(),
  ratings: Joi.array().items(ratingSchema).default([]), // default empty array
  action: Joi.string().valid("Pending", "Approved", "Rejected").default("Pending"),
  reason: Joi.string().max(500).allow("").optional(),
});

export const updateServiceProviderSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  serviceType: Joi.string().min(3).max(100).optional(),
  cost: Joi.number().positive().precision(2).optional(),
  ratings: Joi.array().items(ratingSchema).default([]), // default empty array
  action: Joi.string().valid("Pending", "Approved", "Rejected").optional(),
  reason: Joi.string().max(500).allow("").optional(),
});


// ✅ ID validation
export const serviceProviderIdSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required(),
});


/**
 * Validation schema for admin updating a service provider's action & reason
 * Both fields are mandatory
 */
export const updateServiceProviderActionSchema = Joi.object({
  action: Joi.string()
    .valid("Pending", "Approved", "Disapproved", "Suspended")
    .required()
    .messages({
      "any.required": "Action is required",
      "any.only": "Action must be one of Pending, Approved, Disapproved, Suspended",
    }),
  reason: Joi.string()
    .max(500)
    .required()
    .messages({
      "any.required": "Reason is required",
      "string.max": "Reason cannot exceed 500 characters",
    }),
});