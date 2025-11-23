// validations/service.validation.js
import Joi from "joi";

// Create Service Validation
export const createServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).allow("").default(""),
  cost: Joi.number().positive().precision(2).required(),
  category: Joi.alternatives().try(
    Joi.string().hex().length(24), // existing category ObjectId
    Joi.string().min(1).max(100)   // new category name
  ).required(),
  wageType: Joi.string().valid("Hourly", "Daily").required(),
  image: Joi.string().uri().required() // single image URL (from multer/Cloudinary)
});

// Update Service Validation
export const updateServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(1000).allow("").optional(),
  cost: Joi.number().positive().precision(2).optional(),
  category: Joi.alternatives().try(
    Joi.string().hex().length(24), // existing category ObjectId
    Joi.string().min(1).max(100)   // new category name
  ).optional(),
  wageType: Joi.string().valid("Hourly", "Daily").optional(),
  image: Joi.string().uri().optional()
});

// Service ID Validation
export const serviceIdSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required()
});

// Get Services by Category Validation
export const getServicesByCategorySchema = Joi.object({
  categoryId: Joi.string().hex().length(24).required() // MongoDB ObjectId
});

export const getServiceCategorySchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required()
});