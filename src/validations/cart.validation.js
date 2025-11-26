import Joi from "joi";
import { objectId } from "./common.validation.js";

export const addToCartSchema = Joi.object({
  productId: objectId.required(),
  quantity: Joi.number().min(1).required(),
});



export const removeFromCartSchema = Joi.object({
  productId: objectId.required(),
});

export const adjustQtySchema = Joi.object({
  productId: objectId.required(),
});

export const checkoutCartSchema = Joi.object({
  // put payment / address fields here if you want
  paymentMethod: Joi.string().optional(),
  shippingAddress: Joi.string().optional(),
});