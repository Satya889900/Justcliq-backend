// // src/repository/featuredService.repository.js
// import FeaturedService from "../models/featuredService.model.js";

// // Create Featured Service
// export const createFeaturedService = async (serviceData) => {
//   return await FeaturedService.create(serviceData);
// };

// // Get all featured services (NO populate)
// export const getFeaturedServicesByCategory = async (categoryId) => {
//   return await FeaturedService.find({ category: categoryId })
//     .sort({ userType: -1, createdAt: -1 })
//     .lean();
// };

// // Get featured service by ID (NO populate)
// export const getFeaturedServiceById = async (serviceId) => {
//   return await FeaturedService.findById(serviceId).lean();
// };

// // Update featured service
// export const updateFeaturedServiceById = async (serviceId, updateData) => {
//   return await FeaturedService.findByIdAndUpdate(serviceId, updateData, {
//     new: true,
//     runValidators: true,
//   }).lean();
// };

// // Delete all featured services by category
// export const deleteFeaturedServicesByCategory = async (categoryId) => {
//   return await FeaturedService.deleteMany({ category: categoryId });
// };

// // Delete featured service by ID
// export const deleteFeaturedServiceById = async (serviceId) => {
//   return await FeaturedService.findByIdAndDelete(serviceId);
// };

// // Fetch by ID (NO populate)
// export const getFeaturedServiceWithCategory = async (serviceId) => {
//   return await FeaturedService.findById(serviceId).lean();
// };

// // Admin fetch all (NO filter)
// export const getAllFeaturedServicesAdmin = async () =>
//   await FeaturedService.find().sort({ createdAt: -1 }).lean();

// // User fetch active only
// export const getAllFeaturedServicesUser = async () =>
//   await FeaturedService.find({ status: "Active" })
//     .sort({ createdAt: -1 })
//     .lean();



import FeaturedService from "../models/featuredService.model.js";

// Create Featured Service
export const createFeaturedService = async (serviceData) => {
  return await FeaturedService.create(serviceData);
};

// (Currently unused – requires "category" field in schema if you actually use it)
export const getFeaturedServicesByCategory = async (categoryId) => {
  return await FeaturedService.find({ category: categoryId })
    .sort({ userType: -1, createdAt: -1 })
    .lean();
};

// Get featured service by ID
export const getFeaturedServiceById = async (serviceId) => {
  return await FeaturedService.findById(serviceId).lean();
};

// Update featured service
export const updateFeaturedServiceById = async (serviceId, updateData) => {
  return await FeaturedService.findByIdAndUpdate(serviceId, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};

// Delete all featured services by category
export const deleteFeaturedServicesByCategory = async (categoryId) => {
  return await FeaturedService.deleteMany({ category: categoryId });
};

// Delete featured service by ID
export const deleteFeaturedServiceById = async (serviceId) => {
  return await FeaturedService.findByIdAndDelete(serviceId);
};

// Fetch by ID
export const getFeaturedServiceWithCategory = async (serviceId) => {
  return await FeaturedService.findById(serviceId).lean();
};

// Admin: get ALL (Active + Inactive)
export const getAllFeaturedServicesAdmin = async () =>
  await FeaturedService.find().sort({ createdAt: -1 }).lean();

// User: get only Active
export const getAllFeaturedServicesUser = async () =>
  await FeaturedService.find({ status: "Active" })
    .sort({ createdAt: -1 })
    .lean();
