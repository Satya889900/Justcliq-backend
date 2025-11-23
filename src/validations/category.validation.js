import Joi from "joi";

// MongoDB ObjectId validation
const objectId = Joi.string().hex().length(24);

// Add Service Category
export const addCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional().allow(""),
 // will be overridden if file uploaded
});

// Add Product Category
export const addProductCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional().allow(""),
});

// Get service by ID
export const getServiceSchema = Joi.object({
  serviceId: objectId.required(),
});



// ✅ Edit Category Schema
export const editCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional().allow(""),
 
});

// ✅ Delete Category Schema
export const deleteCategorySchema = Joi.object({
  categoryId: objectId.required(),
});


export const editProductCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional().allow(""),
});

export const deleteProductCategorySchema = Joi.object({
  categoryId: objectId.required(),
});