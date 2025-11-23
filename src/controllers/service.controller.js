import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  fetchServicesByCategoryService,
  addUserServiceService,
  updateServiceService,
  deleteServiceService,
  getServiceProvidersListService,
   fetchServiceCategoryService,
} from "../services/service.service.js";
import { validate } from "../middlewares/validate.js";
import {
  getServicesByCategorySchema,
  createServiceSchema,
  serviceIdSchema,
  updateServiceSchema,
  getServiceCategorySchema,
} from "../validations/service.validation.js";
import Category from "../models/category.model.js";

// ✅ Get services by category
export const getServicesByCategoryController = [
  validate(getServicesByCategorySchema, "params"),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const services = await fetchServicesByCategoryService(categoryId);
    return res.json(
      new ApiResponse(200, services, "Services fetched successfully")
    );
  }),
];

// ✅ Add service

// ✅ Add service controller
export const addUserServiceController = [
  validate(createServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userType = req.user.userType;
    const file = req.file; // single file from multer

    const serviceData = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      category: req.body.category?.trim(),
      cost: parseFloat(req.body.cost),
      wageType: req.body.wageType, // "Hourly" or "Daily"
    };

    const newService = await addUserServiceService(userId, userType, serviceData, file);

    return res
      .status(201)
      .json(new ApiResponse(201, newService, "Service added successfully"));
  }),
];


// ✅ Update service
// ✅ Update Service Controller
export const updateServiceController = [
  validate(serviceIdSchema, "params"),
   validate(updateServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const file = req.file;
    const updateData = req.body;

    const updatedService = await updateServiceService(serviceId, updateData, file);

    return res.status(200).json(new ApiResponse(200, updatedService, "Service updated successfully"));
  }),
];

// ✅ Delete service
export const deleteServiceController = [
  validate(serviceIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const deleted = await deleteServiceService(serviceId);
    return res.json(
      new ApiResponse(200, deleted, "Service deleted successfully")
    );
  }),
];


export const getServiceProvidersList = asyncHandler(async (req, res) => {
  const serviceProviders = await getServiceProvidersListService();

  return res
    .status(200)
    .json(new ApiResponse(200, serviceProviders, 'Service providers list fetched successfully.'));
});

export const getServiceCategoryController = [
  validate(getServiceCategorySchema, "params"),
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const result = await fetchServiceCategoryService(serviceId);

    res.status(200).json(new ApiResponse(200, result, "Category fetched successfully"));
  }),
];