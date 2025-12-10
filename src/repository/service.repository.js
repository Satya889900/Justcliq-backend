import Service from "../models/service.model.js";
import ServiceProvider from "../models/serviceProvider.model.js";
// Create
export const createService = async (serviceData) => {
  return await Service.create(serviceData);
};

// Read: Get services by category
// Read: Get services by category, admin first
// repository/service.repository.js


// repository/service.repository.js
// repository/service.repository.js

export const getServicesByCategory = async (categoryId) => {
  // 1️⃣ Get approved service IDs (for USER services)
  const approvedProviders = await ServiceProvider.find({
    action: "Approved",
  }).select("serviceId");

  const approvedServiceIds = approvedProviders.map((p) => p.serviceId);

  // 2️⃣ Fetch:
  //    - All ADMIN services in this category (no approval needed)
  //    - USER services ONLY if their serviceId is in approvedServiceIds
  const services = await Service.find({
    category: categoryId,
    $or: [
      { userType: "Admin" }, // ✅ always show admin services
      {
        userType: "User",
        _id: { $in: approvedServiceIds }, // ✅ only approved user services
      },
    ],
  })
    .populate("category", "name")
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  return services || [];
};






// Read: Get service by ID
export const getServiceById = async (serviceId) => {
  return await Service.findById(serviceId)
    .populate("category", "name")
    .populate("user", "firstName lastName email")
    .lean();
};


// Update
export const updateServiceById = async (serviceId, updateData) => {
  return await Service.findByIdAndUpdate(serviceId, updateData, {
    new: true, // return updated doc
    runValidators: true, // ✅ ensure schema validation runs
  }).lean();
};

// Delete
// Delete all services by category
export const deleteServicesByCategory = async (categoryId) => {
  return await Service.deleteMany({ category: categoryId });
};

// Delete: Service by ID ✅
export const deleteServiceById = async (serviceId) => {
  return await Service.findByIdAndDelete(serviceId);
};

// Fetch service by ID and populate category
export const getServiceWithCategory = async (serviceId) => {
  return await Service.findById(serviceId)
    .populate("category", "name") // Only fetch category name
    .lean();
};