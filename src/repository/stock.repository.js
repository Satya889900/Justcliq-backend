// repository/stock.repository.js
import Product from "../models/product.model.js";
import Service from "../models/service.model.js";
import ProductCategory from "../models/productCategory.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import UserProduct from "../models/userProduct.model.js";  // ✅ REQUIRED


// export const getProductsByCategoryId = async (categoryId) => {
//   return await Product.find({ category: categoryId })
//     .populate({
//        path: "user",
//        select: "firstName lastName userType",
       
//        })
//     .populate({ path: "category", select: "name" })
//     .lean();
// };

// export const getServicesByCategoryId = async (categoryId) => {
//   return await Service.find({ category: categoryId })
//     .populate({ path: "user",
//        select: "firstName lastName userType",
      
//       })
//     .populate({ path: "category",
//        select: "name" })
//     .lean();
// };

// export const findCategoryById = async (categoryId, type = "product") => {
//   if (type === "product") {
//     return await ProductCategory.findById(categoryId);
//   } else {
//     return await Category.findById(categoryId);
//   }
// };


// export const updateProductById = async (productId, updateData,unsetFields = []) => {
//   const updateQuery = {
//     $set: updateData,
//   };

//   if (unsetFields.length > 0) {
//     updateQuery.$unset = unsetFields.reduce((acc, field) => {
//       acc[field] = "";
//       return acc;
//     }, {});
//   }

//   return await Product.findByIdAndUpdate(productId, updateQuery, {
//     new: true,
//     runValidators: true,
//   })
//     .populate({ path: "user", select: "firstName lastName" })
//     .populate({ path: "category", select: "name" })
//     .lean();
// };

// export const updateServiceById = async (serviceId, updateData) => {
//   return await Service.findByIdAndUpdate(serviceId, updateData, {
//     new: true,
//     runValidators: true,
//   })
//     .populate({ path: "user", select: "firstName lastName" })
//     .populate({ path: "category", select: "name" })
//     .lean();
// };


export const getProductsByCategoryId = async (categoryId) => {

  // ✅ ADMIN PRODUCTS
  const adminProducts = await Product.find({ category: categoryId })
    .populate("user", "firstName lastName userType")
    .populate("category", "name")
    .lean();

  // ✅ USER APPROVED PRODUCTS
  const userProducts = await UserProduct.find({
    category: categoryId,
    status: "Approved",   // ✅ ONLY APPROVED
  })
    .populate("user", "firstName lastName userType")
    .populate("category", "name")
    .lean();

  // ✅ MERGE BOTH FOR STOCK MANAGEMENT
  return [...adminProducts, ...userProducts];
};


export const getServicesByCategoryId = async (categoryId) => {
  return await Service.find({ category: categoryId })
    .populate("user", "firstName lastName userType")
    .populate("category", "name")
    .lean();
};

export const findCategoryById = async (categoryId, type) => {
  return type === "product"
    ? await ProductCategory.findById(categoryId)
    : await Category.findById(categoryId);
};

export const updateProductById = async (id, data) => {
  return await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  )
    .populate("user", "firstName lastName")
    .populate("category", "name")
    .lean();
};


export const updateServiceById = async (id, data) => {
  return await Service.findByIdAndUpdate(id, data, { new: true })
    .populate("user", "firstName lastName")
    .populate("category", "name")
    .lean();
};




// 🔍 Find category by name
export const findProductCategoryByName = async (name) => {
  return await ProductCategory.findOne({ name });
};

// ➕ Create a new category dynamically
export const createProductCategory = async (name, creatorId, creatorModel = "Admin") => {
  const newCategory = new ProductCategory({
    name,
    description: `${name} category`,
    createdBy: creatorId,
    creatorModel,
  });
  return await newCategory.save();
};

// 🔍 Find vendor by name (first + last)
export const findVendorByName = async (fullName) => {
  if (!fullName) return null;
  const [firstName, ...rest] = fullName.trim().split(" ");
  const lastName = rest.join(" ");
  return (
    (await User.findOneAndUpdate({ firstName, lastName })) ||
    (await Admin.findOne({ firstName, lastName }))
  );
};


/** ➕ Create new category if not exists */
export const createCategory = async (name, creatorId = null) => {
  const newCategory = new Category({
    name,
    description: `${name} category (auto-created)`,
    createdBy: creatorId,
  });
  return await newCategory.save();
};

/** 🔍 Find category by name (case-insensitive) */
export const findCategoryByName = async (name) => {
  return await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
};

export const findProductById = async (productId) => {
  return await Product.findById(productId)
    .populate("category", "name")
    .populate("user", "firstName lastName userType");
};