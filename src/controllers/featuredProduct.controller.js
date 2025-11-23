// src/controllers/featuredProduct.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  addFeaturedProductService,
  updateFeaturedProductService,
  deleteFeaturedProductService,
  fetchAllFeaturedProductsService,
} from "../services/featuredProduct.service.js";

import { validate } from "../middlewares/validate.js";

import {
  createFeaturedProductSchema,
  updateFeaturedProductSchema,
  featuredProductIdSchema,
} from "../validations/featuredProduct.validation.js";

// Create Featured Product
export const addFeaturedProductController = [
  validate(createFeaturedProductSchema, "body"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userType = req.user.userType;
    const file = req.file;

    const product = await addFeaturedProductService(userId, userType, req.body, file);

    res.status(201).json(new ApiResponse(201, product, "Featured product added"));
  }),
];

// Get All Featured Products
export const getAllFeaturedProductsController = asyncHandler(async (req, res) => {
  const userType = req.user?.userType || "User";  // default for safety

  const products = await fetchAllFeaturedProductsService(userType);

  res.json(new ApiResponse(200, products, "Featured products fetched"));
});


// Update Featured Product
export const updateFeaturedProductController = [
  validate(featuredProductIdSchema, "params"),
  validate(updateFeaturedProductSchema, "body"),
  asyncHandler(async (req, res) => {
    const updated = await updateFeaturedProductService(
      req.params.productId,
      req.body,
      req.file
    );

    res.json(new ApiResponse(200, updated, "Featured product updated"));
  }),
];

// Delete Featured Product
export const deleteFeaturedProductController = [
  validate(featuredProductIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const deleted = await deleteFeaturedProductService(req.params.productId);
    res.json(new ApiResponse(200, deleted, "Featured product deleted"));
  }),
];
