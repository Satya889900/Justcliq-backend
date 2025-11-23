// validations/admin.validation.js
import Joi from "joi";

export const getAdminProfileSchema = Joi.object({
  adminId: Joi.string().hex().length(24).required(), // MongoDB ObjectId
});

// Example: If you later add admin update
export const updateAdminSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^\d{10}$/).optional(),
  address: Joi.string().max(200).optional(),
  password: Joi.string().min(6).optional(),
  profileImage: Joi.string().uri().optional(), // For the uploaded image URL
});


// 👇 New login validation
export const loginAdminSchema = Joi.object({
  identifier: Joi.alternatives().try(
    Joi.string().email(),       // email
    Joi.string().pattern(/^\d{10}$/) // phone (10 digits)
  ).required(),
  password: Joi.string().min(6).required(),
});