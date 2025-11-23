// src/repository/featuredProduct.repository.js
import FeaturedProduct from "../models/featuredProduct.model.js";

export const createFeaturedProduct = async (data) =>
  await FeaturedProduct.create(data);

export const getFeaturedProductById = async (id) =>
  await FeaturedProduct.findById(id).lean();

export const updateFeaturedProductById = async (id, data) =>
  await FeaturedProduct.findByIdAndUpdate(id, data, { new: true }).lean();

export const deleteFeaturedProductById = async (id) =>
  await FeaturedProduct.findByIdAndDelete(id);

export const getAllFeaturedProducts = async (filter = {}) =>
  await FeaturedProduct.find(filter).sort({ createdAt: -1 }).lean();
 
