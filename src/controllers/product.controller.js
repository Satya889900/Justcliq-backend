/* product.controller.js */

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as service from "../services/product.service.js";
import { validate } from "../middlewares/validate.js";
import {
  addProductSchema,
  updateProductSchema,
  getProductSchema,
  getProductsByCategorySchema,
  getProductCategorySchema,
} from "../validations/product.validation.js";
// controllers/product.controller.js (add import at top: optionally)
import { fetchMergedProductsByCategoryService } from "../services/product.service.js";


// Add product with multiple images
// Add Product with multiple images
export const addProduct = [
  validate(addProductSchema,"body"),
 asyncHandler(async (req, res) => {
    const product = await service.addProductService(req.body, req.user);
    res.status(201).json(new ApiResponse(201, product, "Product added successfully"));
  }),
];


// ✅ Get All Products
export const getAllProductsController = asyncHandler(async (req, res) => {
  const products = await service.fetchAllProductsService();
  res.json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Single Product
export const getProductController = [
  validate(getProductSchema, "params"),
  asyncHandler(async (req, res) => {
    const product = await service.fetchProductByIdService(req.params.productId);
    res.json(new ApiResponse(200, product, "Product fetched successfully"));
  }),
];

// ✅ Update Product
// Update product
export const updateProductController = [
  validate(updateProductSchema,"body"),
 asyncHandler(async (req, res) => {
    const product = await service.updateProductService(req.params.productId, req.body);
    res.json(new ApiResponse(200, product, "Product updated successfully"));
  }),
];

// ✅ Delete Product
export const deleteProductController = asyncHandler(async (req, res) => {
  const deleted = await service.deleteProductService(req.params.productId);
  res.json(new ApiResponse(200, deleted, "Product deleted successfully"));
});

// ✅ Get Products by Category
export const getProductsByCategoryController = [
  validate(getProductsByCategorySchema, "params"),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const products = await service.fetchProductsByCategoryService(categoryId);
    res.json(new ApiResponse(200, products, "Products fetched successfully"));
  }),
];

// ✅ Delete all Products by Category
export const deleteProductsByCategoryController = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const result = await service.deleteProductsOfCategoryService(categoryId);
  res.json(new ApiResponse(200, result, "All products in category deleted successfully"));
});

// Controller
export const getCategoryNameByProductController = [
  validate(getProductCategorySchema, "params"),
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const result = await service.fetchCategoryNameByProductService(productId);
    res.json(new ApiResponse(200, result, "Category name fetched successfully"));
  }),
];


/**
 * Admin: Get merged products in category (Admin + Approved User products)
 * Query params: page, limit, sortBy, order
 */
export const getMergedProductsByCategoryController = [
  validate(getProductsByCategorySchema, "params"), // reuse existing validation for categoryId
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { page, limit, sortBy, order } = req.query;

    const result = await fetchMergedProductsByCategoryService(categoryId, {
      page,
      limit,
      sortBy,
      order,
    });

    return res.json(new ApiResponse(200, result, "Merged products fetched successfully"));
  }),
];
