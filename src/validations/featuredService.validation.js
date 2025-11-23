import Joi from "joi";

export const createFeaturedServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  status: Joi.string().valid("Active", "Inactive").optional(),
});

export const updateFeaturedServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  status: Joi.string().valid("Active", "Inactive").optional(),
});

export const featuredServiceIdSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required(),
});
