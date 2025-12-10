import { ApiError } from "../utils/ApiError.js";
import {
  createService,
  getServicesByCategory,
  getServiceById,
  updateServiceById,
  deleteServicesByCategory,
  deleteServiceById,
  getServiceWithCategory,
  searchServicesByCategoryNameRepository,
} from "../repository/service.repository.js";
import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";

// Fetch services by category
export const fetchServicesByCategoryService = async (categoryId) => {
  if (!categoryId) throw new ApiError(400, "Category ID is required");
  const services = await getServicesByCategory(categoryId);
  return services || [];
};

// Add service
// Add a service
export const addUserServiceService = async (userId, userType, serviceData, file) => {
  const { name, description, category, cost, wageType } = serviceData;

  // ✅ BASIC REQUIRED VALIDATION (NO wageType here)
  if (!name || !category || !cost) {
    throw new ApiError(400, "Name, category and cost are required");
  }

  // ✅ ONLY ADMIN MUST SEND wageType
  if (userType === "Admin" && !wageType) {
    throw new ApiError(400, "wageType is required for Admin");
  }

  let categoryId;

  // ✅ CATEGORY HANDLING
  if (/^[0-9a-fA-F]{24}$/.test(category)) {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) throw new ApiError(404, "Category not found");
    categoryId = existingCategory._id;
  } else {
    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }
    categoryId = existingCategory._id;
  }

  // ✅ FINAL PAYLOAD
  const payload = {
    name,
    description: description || "",
    category: categoryId,
    cost,
    user: userId,
    userType,
    image: file?.path || "",
    imagePublicId: file?.filename || "",
  };

  // ✅ ADD wageType ONLY IF ADMIN
  if (userType === "Admin") {
    payload.wageType = wageType;
  }

  return await createService(payload);
};


// Update service

// ✅ Update Service
export const updateServiceService = async (
  serviceId,
  updateData,
  file,
  currentUser
) => {
  const service = await getServiceById(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  // ✅ PERMISSION
  if (currentUser.userType !== "Admin") {
    if (String(service.user) !== String(currentUser._id)) {
      throw new ApiError(403, "You are not allowed to edit this service");
    }
  }

  const safeUpdateData = {};

  // ✅ NAME
  if (updateData.name !== undefined)
    safeUpdateData.name = updateData.name.trim();

  // ✅ DESCRIPTION
  if (updateData.description !== undefined)
    safeUpdateData.description = updateData.description.trim();

  // ✅ COST
  if (updateData.cost !== undefined)
    safeUpdateData.cost = Number(updateData.cost);

  // ✅ WAGE TYPE
  if (updateData.wageType !== undefined) {
    if (!["Hourly", "Daily"].includes(updateData.wageType)) {
      throw new ApiError(400, 'wageType must be "Hourly" or "Daily"');
    }
    safeUpdateData.wageType = updateData.wageType;
  }

  // ✅ CATEGORY (ID OR NAME BOTH SUPPORTED)
  if (updateData.category !== undefined) {
    let categoryInput = updateData.category.trim();

    if (!categoryInput.match(/^[0-9a-fA-F]{24}$/)) {
      const categoryDoc = await Category.findOne({ name: categoryInput });
      if (!categoryDoc)
        throw new ApiError(400, `Category "${categoryInput}" not found`);
      safeUpdateData.category = categoryDoc._id;
    } else {
      safeUpdateData.category = categoryInput;
    }
  }

  // ✅ IMAGE
  if (file) {
    safeUpdateData.image = file.path;
    safeUpdateData.imagePublicId = file.filename;
  }

  // ✅ FINAL UPDATE
  const updatedService = await updateServiceById(serviceId, safeUpdateData);
  if (!updatedService) throw new ApiError(500, "Service update failed");

  return updatedService;
};



// Delete service
export const deleteServiceService = async (serviceId) => {
  const service = await getServiceById(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  if (service.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(service.imagePublicId);
    } catch (err) {
      console.error("❌ Failed to delete image from Cloudinary:", err.message);
    }
  }

  const deleted = await deleteServiceById(serviceId);
  if (!deleted) throw new ApiError(404, "Failed to delete service");

  return service;
};


// Delete all services when a category is deleted
export const deleteServicesOfCategoryService = async (categoryId) => {
  if (!categoryId) throw new ApiError(400, "Category ID is required");

  // Fetch all services for this category
  const services = await getServicesByCategory(categoryId);

  // Clean up Cloudinary images if they exist
  for (const service of services) {
    if (service.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (err) {
        console.error(`❌ Failed to delete Cloudinary image for service ${service._id}:`, err.message);
      }
    }
  }

  // Bulk delete from DB
  const result = await deleteServicesByCategory(categoryId);
  return result;
};


export const getServiceProvidersListService = async () => {
  const serviceProviders = await getServiceProvidersRepository();

  return serviceProviders.map(provider => {
    const ratings = Array.isArray(provider.ratings) ? provider.ratings : [];

    const averageRating = calculateAverageRating(Array.isArray(provider.ratings) ? provider.ratings : []);

    
    return {
      _id: provider._id,
      name: provider.name,
      serviceType: provider.serviceType,
      cost: provider.cost,
      previousRating: averageRating,
      action: provider.action || 'Pending', // fallback if undefined
      reason: provider.reason || '',        // fallback if undefined
    };
  });
};

export const fetchServiceCategoryService = async (serviceId) => {
  const service = await getServiceWithCategory(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  if (!service.category) throw new ApiError(404, "Category not found for this service");

  return {
    serviceId: service._id,
    // serviceName: service.name,
    // categoryId: service.category._id,
    categoryName: service.category.name
  };
};


export const searchServicesByNameService = async (keyword) => {
  if (!keyword) throw new ApiError(400, "Search keyword is required");

  const services = await searchServicesByCategoryNameRepository(keyword);
  return services || [];
};
