// validations/user.validation.js
import Joi from "joi";

// Phone number must be exactly 10 digits
const phoneSchema = Joi.string().pattern(/^\d{10}$/).required();

export const requestOtpSchema = Joi.object({
  phone: phoneSchema,
});

export const loginWithOtpSchema = Joi.object({
  phone: phoneSchema,
  otp: Joi.string().length(4).required(), // ✅ Changed to 4-digit OTP
});

export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),     // ✔️ Required
  phone: phoneSchema,
  userType: Joi.string()
    .valid("User", "ServiceProvider", "Admin")
    .default("User"),
  password: Joi.string().min(6).when('userType', {
    is: 'Admin',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const updateUserProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: phoneSchema.optional(),
  businessName: Joi.string().max(100).optional(),
  address: Joi.string().max(200).optional(),
  addressLink: Joi.string().uri().optional(),
});
