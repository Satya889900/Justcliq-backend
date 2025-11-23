import Service from "../models/service.model.js";

// Create
export const createService = async (serviceData) => {
  return await Service.create(serviceData);
};

// Read: Get services by category
// Read: Get services by category, admin first
export const getServicesByCategory = async (categoryId) => {
  const services = await Service.find({ category: categoryId })
    .populate("category", "name")
    .populate("user", "firstName lastName email") // Better user info
    .sort({ userType: -1, createdAt: -1 }) // ✅ Admin (userType="Admin") first, then by creation date
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