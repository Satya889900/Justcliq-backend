import Joi from "joi";
import mongoose from "mongoose";

// Mongo ObjectId validation
const objectId = Joi.string().hex().length(24);

/* ============================
   ADD PRODUCT (DYNAMIC UNIT)
============================ */
export const addProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  category: Joi.string().required(), // ObjectId or new category name

  cost: Joi.number().positive().required(),

  // 🔥 FULLY DYNAMIC UNIT
  unit: Joi.string().min(1).required(), // box, kg, packet, anything

  // 🔥 SINGLE STOCK FIELD
  value: Joi.number().min(0).required(),

  description: Joi.string().max(1000).allow("").optional(),

  image: Joi.string().uri().required(), // Cloudinary URL
});


/* ============================
   UPDATE PRODUCT
============================ */
export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),

  category: Joi.string().optional(),

  cost: Joi.number().positive().optional(),

  unit: Joi.string().min(1).optional(),   // dynamic

  value: Joi.number().min(0).optional(),  // dynamic

  description: Joi.string().max(1000).allow("").optional(),

  image: Joi.string().uri().optional(),
});


/* ============================
   GET PRODUCT BY ID
============================ */
export const getProductSchema = Joi.object({
  productId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),
});


/* ============================
   GET PRODUCTS BY CATEGORY
============================ */
export const getProductsByCategorySchema = Joi.object({
  categoryId: objectId.required(),
});


/* ============================
   GET CATEGORY BY PRODUCT
============================ */
export const getProductCategorySchema = Joi.object({
  productId: objectId.required(),
});
