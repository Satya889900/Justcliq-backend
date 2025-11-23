// controllers/stock.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { 
  getAllCategoriesForStock,
   getItemsByCategory,
   editProduct,
    editService,
    batchUpdateStock
   } from "../services/stock.service.js";
import { validate } from "../middlewares/validate.js";

import { getCategoriesSchema,
    getItemsByCategorySchema,
    getItemsTypeSchema,
    editProductSchema,
    editServiceSchema,
    idParamSchema,
   batchUpdateStockSchema,
 } from "../validations/stock.validation.js";

export const getAllCategoriesForStockController =[
     validate(getCategoriesSchema, "query"),
     asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesForStock();
  res.json(new ApiResponse(200, categories, "Service and Product categories fetched successfully"));
})
] ;


export const getItemsByCategoryController = [
  validate(getItemsByCategorySchema, "params"),
   validate(getItemsTypeSchema, "query"),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params; // get categoryId from params
    const { type } = req.validatedQuery;

    const items = await getItemsByCategory(categoryId, type);
    res.json(new ApiResponse(200, items, `${type} items fetched successfully`));
  })
];


// ✅ Fixed version — extracts ID from URL params
export const editProductController = [
  validate(idParamSchema, "params"),
  validate(editProductSchema, "body"),
  asyncHandler(async (req, res) => {
const { categoryId } = req.validatedParams;

    const updatedProduct = await editProduct(productId, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
  }),
];

export const editServiceController = [
  validate(idParamSchema, "params"),
  validate(editServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const updatedService = await editService(serviceId, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, updatedService, "Service updated successfully"));
  }),
];

import { ApiError } from "../utils/ApiError.js"; // add if missing

export const batchUpdateStockController = [
  validate(batchUpdateStockSchema, "body"),
  asyncHandler(async (req, res) => {
    const { type, updates } = req.body;
   const result = await batchUpdateStock(type, updates);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Stock updated successfully"));
  }),
];
