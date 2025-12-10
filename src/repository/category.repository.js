import Category from "../models/category.model.js";
import Service from "../models/service.model.js"; 
// repository/user/productCategory/productCategory.repository.js
import ProductCategory from "../models/productCategory.model.js";
import Product from "../models/product.model.js";



// Seed default product categories
export const createDefaultProductCategories = async () => {
  // const defaults = [
  //   { name: "Fruits", description: "Fresh fruits" },
  //   { name: "Vegetables", description: "Fresh vegetables" },
  //   { name: "Grocery", description: "Daily grocery items" },
  //   { name: "Chocolates", description: "Chocolates & sweets" },
  //   { name: "Dairy", description: "Milk, cheese, butter, etc." },
  // ];

  // for (const cat of defaults) {
  //   const exists = await ProductCategory.findOne({ name: cat.name });
  //   if (!exists) {
  //     await ProductCategory.create(cat);
  //   }
  // }
};

// repository/admin/category.repository.js
export const createCategory = async (categoryData) => {
  // Save image as string in MongoDB
  return await Category.create(categoryData );
};


// ✅ Find category by name
export const findCategoryByName = async (name) => {
  return await Category.findOne({ name });
};

// Fetch all categories
export const getAllCategories = async () => {
  return await Category.find().sort({ userType: -1, name: 1 }).lean(); // assuming userType field exists and Admin is prioritized
};



// Fetch a specific service by ID
export const getServiceById = async (serviceId) => {
  return await Service.findById(serviceId)
    .populate("category", "name")   // populate category name
    .populate("user", "firstName lastName email phone")
    .lean(); // populate user/vendor info
};


// Find category by ID
export const findCategoryById = async (id) => {
 return await Category.findById(id);
};

// Update category by ID
export const updateCategoryById = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete category by ID
export const deleteCategoryById = async (id) => {
  return await Category.findByIdAndDelete(id);
};

// Find by ID
export const findProductCategoryById = async (id) => {
  return await ProductCategory.findById(id);
};

// Find by name
export const findProductCategoryByName = async (name) => {
  return await ProductCategory.findOne({ name });
};

// Update category by ID
export const updateProductCategoryById = async (id, updateData) => {
  return await ProductCategory.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete category by ID
export const deleteProductCategoryById = async (id) => {
  return await ProductCategory.findByIdAndDelete(id);
};

// Fetch all categories with admin-created items first
export const getAllProductCategories = async () => {
  return await ProductCategory.find().sort({ userType: -1, name: 1 }).lean(); // Assuming createdBy field references Admin
};

// Count services in a category
export const countServicesInCategory = async (categoryId) => {
  return await Service.countDocuments({ category: categoryId });
};

// Count products in a category
export const countProductsInCategory = async (categoryId) => {
  return await Product.countDocuments({ category: categoryId });
};


export const searchServiceCategoriesByPrefixRepository = async (keyword) => {
  const regex = new RegExp(`^${keyword}`, "i"); // ✅ c, co, car, cool etc

  const categories = await Category.find({
    name: { $regex: regex }
  })
  .select("_id name image createdAt")
  .sort({ name: 1 })
  .lean();

  return categories || [];
};
