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
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const { name, category, unit, weight, cost } = req.body;

  const image = req.file?.path || null;

  const newProduct = await Product.create({
    name,
    category,
    unit,
    weight,
    cost,
    image,
    user: req.user._id,
    status: "Pending",
    userType: "User",
  });

  res.json(
    new ApiResponse(201, newProduct, "Product added successfully (Pending Approval)")
  );
});
export const updateUserProductController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const updates = {
    name: req.body.name,
    unit: req.body.unit,
    weight: req.body.weight,
    cost: req.body.cost,
  };

  if (req.file?.path) {
    updates.image = req.file.path;
  }

  const updated = await Product.findByIdAndUpdate(productId, updates, {
    new: true,
  });

  res.json(new ApiResponse(200, updated, "Product updated successfully"));
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
   USER: DELETE PRODUCT
============================================================ */
export const deleteUserProductController = asyncHandler(async (req, res) => {
  const result = await deleteUserProductService(req.params.productId, req.user._id);
  res.json(new ApiResponse(200, result, "Product deleted successfully"));
});
