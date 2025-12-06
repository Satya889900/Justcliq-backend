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
import UserProduct from "../models/userProduct.model.js";


/* ============================================================
   USER: ADD PRODUCT
============================================================ */
import cloudinary from "../config/cloudinary.js";

export const addUserProductController = asyncHandler(async (req, res) => {
  const { name, category, cost, unit } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  // CloudinaryStorage already uploads the image
  const imageUrl = req.file.path;   // Cloudinary URL

  const newProductData = {
    name,
    category,
    cost,
    unit,
    user: req.user._id,
    userType: "User",
    status: "Pending",
    image: imageUrl,
    quantity: unit === "quantity" ? req.body.quantity : undefined,
    weight: unit === "kg" ? req.body.weight : undefined,
    volume: unit === "liters" ? req.body.volume : undefined,
  };

  const newProduct = await Product.create(newProductData);

  res.json(
    new ApiResponse(201, newProduct, "Product added successfully (Pending Approval)")
  );
});




export const updateUserProductController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let updates = {};

  if (req.body.name) updates.name = req.body.name;
  if (req.body.cost) updates.cost = req.body.cost;
  if (req.body.unit) updates.unit = req.body.unit;

  if (req.body.unit === "quantity") {
    updates.quantity = req.body.quantity;
    updates.weight = undefined;
    updates.volume = undefined;
  } else if (req.body.unit === "kg") {
    updates.weight = req.body.weight;
    updates.quantity = undefined;
    updates.volume = undefined;
  } else if (req.body.unit === "liters") {
    updates.volume = req.body.volume;
    updates.quantity = undefined;
    updates.weight = undefined;
  }

  if (req.file) {
    const cloudUpload = await cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (!error) updates.image = result.secure_url;
      }
    );

    cloudUpload.end(req.file.buffer);
  }

  let updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updates },
    { new: true, lean: true }
  );

  res.json(new ApiResponse(200, updatedProduct, "Updated successfully"));
});




/* ============================================================
   USER: MY OWN PRODUCTS
============================================================ */
export const getMyProductsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const products = await Product.find({ user: userId })
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

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
export const getMyApprovedProductsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch only products created by THIS user AND approved by admin
  const products = await UserProduct.find({
    user: userId,
    status: "Approved"
  })
    .populate("category", "name")
    .lean();

  return res.json(
    new ApiResponse(200, products, "Your approved products fetched successfully")
  );
});
