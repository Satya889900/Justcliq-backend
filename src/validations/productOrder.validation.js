import Joi from "joi";
import { objectId } from "./common.validation.js";

export const getOrdersSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  status: Joi.string()
    .valid("Upcoming", "Out for Delivery", "Delivered", "Cancelled", "Not Delivered")
    .optional(),
});

export const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
});


export const getProductPosterSchema = Joi.object({
  productName: Joi.string().trim().required().messages({
    "any.required": "Product name is required",
    "string.empty": "Product name cannot be empty",
  }),
});


export const assignVendorSchema = Joi.object({
  vendorId: objectId.required().messages({
    "any.required": "Vendor ID is required",
  }),
   vendorType: Joi.string().valid("User", "Admin").required().messages({
    "any.only": "Vendor type must be 'User' or 'Admin'",
    "any.required": "Vendor type is required",
  }),
});


export const feedbackSchema = Joi.object({
  feedback: Joi.string().optional(),
});

export const cancelOrderSchema = Joi.object({
  cancelledBy: Joi.string().valid("User", "Vendor").required(),
});