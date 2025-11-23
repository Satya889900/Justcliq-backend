

import { ApiError } from "../utils/ApiError.js";
import { getAllCategories,
   getServiceById, 
 findCategoryById,
 updateCategoryById,
deleteCategoryById,
  createCategory,
   findCategoryByName,
   findProductCategoryById,
  findProductCategoryByName,
  updateProductCategoryById,
  deleteProductCategoryById,
  countServicesInCategory,
  countProductsInCategory,
  getAllProductCategories, } from "../repository/category.repository.js";
import cloudinary from "../config/cloudinary.js";
import { deleteServicesByCategory } from "../repository/service.repository.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ProductCategory from "../models/productCategory.model.js";




export const addCategory = async (name, description, image,user) => {
  const existingCategory = await findCategoryByName(name);
  if (existingCategory) {
    throw new ApiError(400, "Category with this name already exists");
  }

  // Pass the image string to Mongoose
  const newCategory = await createCategory({
    name,
     description,
      image,
      userType:user.userType,
      createdBy: user._id,
    });
  return newCategory;
};


// Add a new service category
export const addCategoryService = async ({ name, description, image, user }) => {
  if (!name) throw new ApiError(400, "Category name is required");

  const existing = await findCategoryByName(name);
  if (existing) throw new ApiError(409, "Category already exists");

  const category = await createCategory({
    name,
    description,
    image,
    userType: user.userType, // Admin or User
    createdBy: user._id,
  });

  return category;
};

// Fetch all categories with admin first
export const fetchProductCategoriesService = async () => {
  const categories = await getAllProductCategories();
  return categories;
};


export const fetchCategoriesService = async () => {
  // Ensure default categories exist
  

  const categories = await getAllCategories();

  if (!categories || categories.length === 0) {
    throw new ApiError(404, "No categories found");
  }

  return categories;
};

export const getService = async (serviceId) => {
  const service = await getServiceById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};


// Edit / Update Category
// Edit / Update Category with optional image
export const editCategoryService = async (categoryId, updateData, file) => {
  const category = await findCategoryById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");

  // Prevent duplicate name
  if (updateData.name && updateData.name !== category.name) {
    const existing = await findCategoryByName(updateData.name);
    if (existing) throw new ApiError(409, "Category name already exists");
  }

  // Upload new image if file exists
  if (file) {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "categoryImages",
      resource_type: "image",
    });
    updateData.image = uploadResult.secure_url;
  }

  return await updateCategoryById(categoryId, updateData,  { new: true });
};

// Delete Category


// Delete service category with cascade delete
export const deleteServiceCategoryService = async (categoryId) => {
  if (!categoryId) throw new ApiError(400,
     "Category ID is required");

  const category = await findCategoryById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");
  
const serviceCount = await countServicesInCategory(categoryId);
let serviceWord=serviceCount>1?"services":"service";
  if (serviceCount > 0) {
    throw new ApiError(
      400,
      `Category contains ${serviceCount} ${serviceWord}. Please delete all services first.`
    );
  }

  // Delete the category itself
  await deleteCategoryById(categoryId);

  return new ApiResponse(200, null, "Service category deleted successfully");
};



// services/category.service.js

// category.service.js
export const addProductCategoryService = async ({ name, description, image }, user) => {
  if (!name) throw new ApiError(400, "Product category name is required");
  if (!user) throw new ApiError(401, "Unauthorized: User information missing");

  const existing = await ProductCategory.findOne({ name });
  if (existing) throw new ApiError(409, "Product category already exists");

  const category = await ProductCategory.create({
    name,
    description,
    image,
    createdBy: user._id,          // ✅ attach user ID
    creatorModel: user.userType,  // ✅ attach model type (Admin/User/ServiceProvider)
  });

  return category;
};




// Edit product category
export const editProductCategoryService = async (categoryId, updateData) => {
  const category = await findProductCategoryById(categoryId);
  if (!category) throw new ApiError(404, "Product category not found");

  if (updateData.name && updateData.name !== category.name) {
    const existing = await findProductCategoryByName(updateData.name);
    if (existing) throw new ApiError(409, "Product category name already exists");
  }

  return await updateProductCategoryById(categoryId, updateData);
};

// Delete product category
export const deleteProductCategoryService = async (categoryId) => {
  const category = await findProductCategoryById(categoryId);
  if (!category) throw new ApiError(404,
     "Product category not found");

       const productCount = await countProductsInCategory(categoryId);
       let productWord=productCount>1?"products":"product";
  if (productCount > 0) {
    throw new ApiError(
      400,
      `Category contains ${productCount} ${productWord}. Please delete all products first.`
    );
  }

  await deleteProductCategoryById(categoryId);
  return new ApiResponse(200, null,
     "Product category deleted successfully");
};