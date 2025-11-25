// src/controllers/userProduct.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  addUserProductService,
  updateUserProductService,
  getAllApprovedProductsService,
  getUserProductByIdService,
  getApprovedProductsByCategoryService,
  deleteUserProductService,
} from "../services/userProduct.service.js";

import Product from "../models/userProduct.model.js";

/* ============================================================
   USER: ADD PRODUCT
============================================================ */
export const addUserProductController = asyncHandler(async (req, res) => {
  const product = await addUserProductService(req.body, req.user);
  res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully (Pending Approval)"));
});

/* ============================================================
   USER: MY OWN PRODUCTS
============================================================ */
export const getMyProductsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const products = await Product.find({ user: userId })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, products, "Your products fetched successfully"));
});

/* ============================================================
   USER: GET ALL APPROVED PRODUCTS
============================================================ */
export const getApprovedProductsController = asyncHandler(async (req, res) => {
  const products = await getAllApprovedProductsService();
  res.json(new ApiResponse(200, products, "Approved products fetched successfully"));
});

/* ============================================================
   USER: GET APPROVED PRODUCT BY ID
============================================================ */
export const getApprovedProductByIdController = asyncHandler(async (req, res) => {
  const product = await getUserProductByIdService(req.params.productId);
  res.json(new ApiResponse(200, product, "Product fetched successfully"));
});

/* ============================================================
   USER: GET PRODUCTS BY CATEGORY
============================================================ */
export const getApprovedProductsByCategoryController = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const products = await getApprovedProductsByCategoryService(categoryId, req.user);

  res.json(new ApiResponse(200, products, "Products fetched successfully"));
});

/* ============================================================
   USER: UPDATE PRODUCT
============================================================ */
export const updateUserProductController = asyncHandler(async (req, res) => {
  const updated = await updateUserProductService(
    req.params.productId,
    req.body,
    req.user._id
  );

  res.json(new ApiResponse(200, updated, "Product updated successfully"));
});

/* ============================================================
   USER: DELETE PRODUCT
============================================================ */
export const deleteUserProductController = asyncHandler(async (req, res) => {
  const result = await deleteUserProductService(req.params.productId, req.user._id);
  res.json(new ApiResponse(200, result, "Product deleted successfully"));
});
