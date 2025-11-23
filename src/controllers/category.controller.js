import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchCategoriesService, getService as getServiceService } from "../services/category.service.js";
import { addCategoryService,
   addCategory,
    fetchProductCategoriesService,
    editCategoryService,
    deleteServiceCategoryService,
   addProductCategoryService,
   editProductCategoryService,
  deleteProductCategoryService,
   } from '../services/category.service.js';
import { validate } from "../middlewares/validate.js";
import { addCategorySchema,
   addProductCategorySchema,
   getServiceSchema,
   editCategorySchema,
  deleteCategorySchema,
 editProductCategorySchema,
  deleteProductCategorySchema, } from "../validations/category.validation.js";
import cloudinary from "../config/cloudinary.js";
import { uploadCategoryImage } from "../middlewares/uploadCategoryMiddleware.js";
// category.service.js


// ✅ Add new service category (Admin Only)
export const addCategoryController = [
  validate(addCategorySchema, "body"),
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    let image = req.body.image || "";

    // Upload to Cloudinary if file exists
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "categoryImages",
        resource_type: "image",
      });
      image = uploadResult.secure_url;
    }

    const category = await addCategory(
      name, description, image
    ,req.user);

    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  }),
];

// ✅ Add new product category
export const addProductCategoryController = [
  validate(addProductCategorySchema, "body"),
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    let image = req.body.image || "";

    // Upload to Cloudinary if file exists
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "productCategoryImages",
        resource_type: "image",
      });
      image = uploadResult.secure_url;
    }

    const newCategory = await addProductCategoryService({ name, description, image },req.user);

    return res
      .status(201)
      .json(new ApiResponse(201, newCategory, "Product category added successfully"));
  }),
];

// ✅ Fetch all service categories
export const getCategoriesController = asyncHandler(async (req, res) => {
  const categories = await fetchCategoriesService();
  return res.json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// ✅ Fetch single service by ID
export const getServiceController = [
  validate(getServiceSchema, "params"),
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const service = await getServiceService(serviceId);

    return res.json(new ApiResponse(200, service, "Service fetched successfully"));
  }),
];




// ✅ Edit Category with optional image
export const editCategoryController = [
   validate(editCategorySchema, "body"),
  uploadCategoryImage.single("image"), // handle file upload
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const updateData = req.body;
    const file = req.file; // new image file, if any

    const updatedCategory = await editCategoryService(categoryId, updateData, file);
    return res
      .status(200)
      .json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
  }),
];



// DELETE /admin/api/service-category/:categoryId
// ✅ Delete Service Category (Admin Only)
// DELETE /admin/api/service-category/:categoryId
export const deleteServiceCategoryController = [
  validate(deleteCategorySchema, "params"),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    // ✅ Use service layer (cascades: deletes services + deletes category)
    const result = await deleteServiceCategoryService(categoryId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Service category and its services deleted successfully"));
  }),
];

// Edit product category
// controllers/category.controller.js
export const editProductCategoryController = [
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const updateData = req.body || {};

    // Only upload if a new file is provided
    const file = req.files?.image?.[0];
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "productCategoryImages",
        resource_type: "image",
      });
      updateData.image = uploadResult.secure_url;
    }

    const updatedCategory = await editProductCategoryService(categoryId, updateData);
    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Product category updated successfully",
      timestamp: new Date().toISOString(),
    });
  }),
];



// Delete product category
export const deleteProductCategoryController = [
 
  validate(deleteProductCategorySchema, "params"),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const result=await deleteProductCategoryService(categoryId);
    res.status(200).json(new ApiResponse(200, result, "Product category deleted successfully"));
  }),
];

// Fetch all product categories
export const getProductCategoriesController = [
  asyncHandler(async (req, res) => {
    const categories = await fetchProductCategoriesService();
    res.status(200).json(new ApiResponse(200, categories, "Product categories fetched successfully"));
  }),
];
