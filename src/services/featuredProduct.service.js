// src/services/featuredProduct.service.js
import { ApiError } from "../utils/ApiError.js";
import {
  createFeaturedProduct,
  getFeaturedProductById,
  updateFeaturedProductById,
  deleteFeaturedProductById,
  getAllFeaturedProducts,
} from "../repository/featuredProduct.repository.js";

import cloudinary from "../config/cloudinary.js";

// Add Featured Product
export const addFeaturedProductService = async (userId, userType, data, file) => {
  const { name , status } = data;

  if (!name) throw new ApiError(400, "Name is required");
  if (!file) throw new ApiError(400, "Image is required");

  const upload = await cloudinary.uploader.upload(file.path, {
    folder: "featuredProducts",
  });

  const payload = {
    name,
    image: upload.secure_url,
    imagePublicId: upload.public_id,
    createdBy: userId,
    userType,
  };

  return await createFeaturedProduct(payload);
};

// Update Featured Product
export const updateFeaturedProductService = async (productId, data, file) => {
  const existing = await getFeaturedProductById(productId);
  if (!existing) throw new ApiError(404, "Featured Product not found");

  const updates = {};

  if (data.name) updates.name = data.name;
  if (data.status) updates.status = data.status;


  if (file) {
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: "featuredProducts",
    });

    updates.image = upload.secure_url;
    updates.imagePublicId = upload.public_id;

    // delete old image
    if (existing.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (e) {}
    }
  }

  return await updateFeaturedProductById(productId, updates);
};

// Delete Featured Product
export const deleteFeaturedProductService = async (productId) => {
  const existing = await getFeaturedProductById(productId);
  if (!existing) throw new ApiError(404, "Featured Product not found");

  if (existing.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(existing.imagePublicId);
    } catch (e) {}
  }

  return await deleteFeaturedProductById(productId);
};

// Get all Featured Products
export const fetchAllFeaturedProductsService = async (userType) => {
  if (userType === "Admin") {
    // Admin sees all
    return await getAllFeaturedProducts();
  }

  // User sees only "Active"
  return await getAllFeaturedProducts({ status: "Active" });
};

