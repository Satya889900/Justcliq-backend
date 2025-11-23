import Joi from "joi";
import mongoose from "mongoose";
import { allowedUnits } from "../models/product.model.js";


// Mongo ObjectId validation
const objectId = Joi.string().hex().length(24);

// Single image, category can be existing ObjectId or new category name
export const addProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().required(), // ObjectId or new category name
  cost: Joi.number().positive().required(),
  unit: Joi.string().valid(...allowedUnits).required(), // ✅ enum validation
  description: Joi.string().max(1000).allow("").optional(),
  image: Joi.string().uri().required(), // single image URL from Cloudinary
   quantity: Joi.when("unit", { is: "quantity", then: Joi.number().positive().required(), otherwise: Joi.forbidden() }),
  weight: Joi.when("unit", { is: "kg", then: Joi.number().positive().required(), otherwise: Joi.forbidden() }),
  volume: Joi.when("unit", { is: "liters", then: Joi.number().positive().required(), otherwise: Joi.forbidden() }),
});

// Update Product
export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: Joi.string().optional(),
  cost: Joi.number().positive().optional(),
  description: Joi.string().max(1000).allow("").optional(),
  image: Joi.string().uri().optional(),
  unit: Joi.string().valid(...allowedUnits).optional(), // ✅ enum validation
    quantity: Joi.when("unit", { is: "quantity", then: Joi.number().positive().required(), otherwise: Joi.forbidden() }),
  weight: Joi.when("unit", { is: "kg", then: Joi.number().positive().required(), otherwise: Joi.forbidden() }),
  volume: Joi.when("unit", { is: "liters", then: Joi.number().positive().required(), otherwise: Joi.forbidden() }),

});

// Get Product by ID
export const getProductSchema = Joi.object({
  productId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .required(),
});


// Get Products by Category
export const getProductsByCategorySchema = Joi.object({
  categoryId: objectId.required(),
});

// Joi validation schema for productId
export const getProductCategorySchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});