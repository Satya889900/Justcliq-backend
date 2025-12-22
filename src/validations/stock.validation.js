/*stock.validation.js*/

import Joi from "joi";

const getCategoriesSchema = Joi.object({});

const objectId = Joi.string().hex().length(24);


export const getItemsByCategorySchema = Joi.object({
  categoryId: objectId.required(),
 
});

export const getItemsTypeSchema = Joi.object({
  type: Joi.string().valid("product", "service").required(),
});


// ✅ EDIT PRODUCT — all optional, dynamic based on `unit`
export const editProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: Joi.alternatives().try(
    objectId,                     // Existing category ID
    Joi.string().min(2).max(100)  // New category name
  ).optional(),
 unit: Joi.string().min(1).required(),   // 🔥 dynamic
  value: Joi.number().min(0).required(), 

  vendorName: Joi.string().optional().allow("", null),
});

// ✅ EDIT SERVICE — all optional, dynamic based on `wageType`
export const editServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: objectId.optional(),
  wageType: Joi.string().valid("Hourly", "Daily").optional(),

  wages: Joi.when("wageType", {
    is: Joi.exist(),
    then: Joi.number().min(0).required(),
    otherwise: Joi.number().min(0).optional(),
  }),

  vendorName: Joi.string().optional().allow(null, ""),
});

// For validating params
export const idParamSchema = Joi.object({
  productId: Joi.string().hex().length(24),
  serviceId: Joi.string().hex().length(24),
}).or("productId", "serviceId");

// ✅ For batch updates
export const batchUpdateStockSchema = Joi.object({
  type: Joi.string().valid("product", "service").required(),
  updates: Joi.array().items(
    Joi.object({
      id: objectId.required(),
      unit: Joi.string().required(),
      value: Joi.number().min(0).required(),
    })
  ).min(1).required(),
});


export {getCategoriesSchema};