import Joi from "joi";
import { objectId } from "./common.validation.js";

export const addToCartSchema = Joi.object({
  productId: objectId.required(),
  quantity: Joi.number().min(1).required(),
});

export const removeFromCartSchema = Joi.object({
  productId: objectId.required(),
});


export const checkoutCartSchema = Joi.object({
  // Optional: if user wants to checkout only certain products
  productIds: Joi.array().items(objectId),
});