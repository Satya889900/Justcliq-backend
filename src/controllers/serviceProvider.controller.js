import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Service from "../models/service.model.js";
import ServiceProvider from "../models/serviceProvider.model.js";
import cloudinary from "../config/cloudinary.js";

import {
  getServiceProvidersListService,
  updateServiceProviderActionService,
  getApprovedProvidersByServiceNameService
} from "../services/serviceProvider.service.js";

/* =====================================================
   CREATE SERVICE PROVIDER PROFILE (USER)
===================================================== */
export const createServiceProviderProfileController = asyncHandler(async (req, res) => {
  
  const { name, categoryId, cost } = req.body;

  if (!name || !categoryId || !cost) {
    throw new ApiError(400, "name, categoryId, and cost are required");
  }

  // Create new service
  const service = await Service.create({
    name,
    category: categoryId, // FIXED HERE ⭐
    cost,
    image: req.file ? req.file.path : "",
    user: req.user._id,
    userType: req.user.userType
  });

  // Create service provider status record
  const providerProfile = await ServiceProvider.create({
    userId: req.user._id,
    serviceId: service._id,
    action: "Pending",
    reason: ""
  });

  return res.status(201).json(
    new ApiResponse(201, { service, providerProfile }, "Service provider profile created successfully")
  );
});


/* =====================================================
   GET MY PROVIDER PROFILE (USER)
===================================================== */
export const getMyServiceProviderProfileController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Use `find` instead of `findOne` to get all services for the user
  const services = await Service.find({ user: userId })
    .sort({ createdAt: -1 }); 

  if (!services || services.length === 0) {
    throw new ApiError(404, "No services found for this user.");
  }

  // Get all service IDs to find their provider statuses
  const serviceIds = services.map(s => s._id);
  const providerStatuses = await ServiceProvider.find({ serviceId: { $in: serviceIds } });

  // Map statuses to service IDs for easy lookup
  const statusMap = new Map();
  providerStatuses.forEach(p => statusMap.set(p.serviceId.toString(), p));

  // Combine service with its status
  const profiles = services.map(service => ({
    service,
    providerStatus: statusMap.get(service._id.toString())?.action || "Pending",
    providerReason: statusMap.get(service._id.toString())?.reason || "",
  }));

  return res.status(200).json(new ApiResponse(200, profiles, "Service provider profiles fetched successfully"));
});


/* =====================================================
   UPDATE MY SERVICE PROVIDER PROFILE (USER)
===================================================== */
export const updateMyServiceProviderProfileController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { serviceId } = req.params;

  // Find service belonging to this user
  const service = await Service.findOne({ _id: serviceId, user: userId });

  if (!service) {
    throw new ApiError(404, "Service not found or you are not authorized");
  }

  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.categoryId) updateData.category = req.body.categoryId;
  if (req.body.cost) updateData.cost = req.body.cost;

  if (req.file) {
    updateData.image = req.file.path; // New image
  }

  const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, { new: true });

  return res.status(200).json(
    new ApiResponse(200, updatedService, "Service provider profile updated successfully")
  );
});


/* =====================================================
   DELETE MY SERVICE PROVIDER PROFILE (USER)
===================================================== */
export const deleteMyServiceProviderProfileController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { serviceId } = req.params;

  const service = await Service.findOne({ _id: serviceId, user: userId });

  if (!service) {
    throw new ApiError(404, "Service not found or unauthorized");
  }

  // Delete image (optional if using Cloudinary)
  if (service.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(service.imagePublicId);
    } catch (error) {}
  }

  // Delete service provider record
  await ServiceProvider.deleteOne({ serviceId });

  // Delete service
  await Service.deleteOne({ _id: serviceId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Service provider profile deleted successfully"));
});

/* =====================================================
   ADMIN: UPDATE ACTION (APPROVE/REJECT/SUSPEND)
===================================================== */
export const updateServiceProviderActionController = [
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const { action, reason } = req.body; // FIXED

    const updatedProvider = await updateServiceProviderActionService(serviceId, action, reason);

    return res.status(200).json(
      new ApiResponse(200, updatedProvider, "ServiceProvider action updated successfully")
    );
  }),
];

/* =====================================================
   GET ALL PROVIDERS (ADMIN)
===================================================== */
export const getServiceProvidersListController = asyncHandler(async (req, res) => {
  const providers = await getServiceProvidersListService();
  return res.status(200).json(new ApiResponse(200, providers, "Service providers list fetched successfully."));
});

/* =====================================================
   GET APPROVED PROVIDERS BY SERVICE NAME (USER)
===================================================== */
export const getApprovedProvidersByServiceNameController = asyncHandler(async (req, res) => {
  const { serviceName } = req.params;
  const providers = await getApprovedProvidersByServiceNameService(serviceName);

  return res.status(200).json(
    new ApiResponse(200, providers, `Approved providers for '${serviceName}' fetched successfully`)
  );
});
