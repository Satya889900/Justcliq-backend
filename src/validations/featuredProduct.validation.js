import Joi from "joi";

export const createFeaturedProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  status: Joi.string().valid("Active", "Inactive").optional(),
});

export const updateFeaturedProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  status: Joi.string().valid("Active", "Inactive").optional(),
});

export const featuredProductIdSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});
