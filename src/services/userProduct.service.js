import { ApiError } from "../utils/ApiError.js";
import Product from "../models/userProduct.model.js";
import ProductCategory from "../models/productCategory.model.js";
import mongoose from "mongoose";

const unitFieldMap = {
  quantity: "quantity",
  kg: "weight",
  liters: "volume",
};


// ===============================================
// 👉 ADD USER PRODUCT (NO DESCRIPTION FIELD)
// ===============================================
export const addUserProductService = async (data, user) => {
  const { name, category, cost, image, unit } = data;

  if (!name || !category || !cost || !image || !unit) {
    throw new ApiError(400, "Name, category, cost, unit, image are required");
  }

  const field = unitFieldMap[unit];
  if (!field || !data[field] || data[field] <= 0) {
    throw new ApiError(400, `${field} is required and must be positive`);
  }

  // CATEGORY (ID or text)
  let categoryId;
  if (mongoose.Types.ObjectId.isValid(category)) {
    const cat = await ProductCategory.findById(category);
    if (!cat) throw new ApiError(404, "Category not found");
    categoryId = cat._id;
  } else {
    let cat = await ProductCategory.findOne({ name: category });
    if (!cat) {
      cat = await ProductCategory.create({
        name: category,
        createdBy: user._id,
        userType: user.userType,
      });
    }
    categoryId = cat._id;
  }

  // CREATE PRODUCT — NO DESCRIPTION
  return await Product.create({
    name,
    category: categoryId,
    cost,
    image,
    unit,
    [field]: data[field],
    user: user._id,
    userType: user.userType,
    status: "Pending",
  });
};


// ===============================================
// 👉 UPDATE USER PRODUCT (NO DESCRIPTION)
// ===============================================
export const updateUserProductService = async (productId, data, userId) => {
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");
  if (product.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You can update only your own product");
  }

  const updateData = { ...data };
  delete updateData.description; // ❌ Remove description completely

  // CATEGORY UPDATE
  if (updateData.category) {
    if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
      let cat = await ProductCategory.findOne({ name: updateData.category });
      if (!cat) {
        cat = await ProductCategory.create({
          name: updateData.category,
          createdBy: userId,
          userType: "User",
        });
      }
      updateData.category = cat._id;
    }
  }

  // UNIT VALIDATION
  if (updateData.unit) {
    const field = unitFieldMap[updateData.unit];
    if (!field || !updateData[field] || updateData[field] <= 0) {
      throw new ApiError(400, `${field} required for '${updateData.unit}'`);
    }
  }

  return await Product.findByIdAndUpdate(productId, updateData, { new: true });
};


// ===============================================
// OTHER SERVICES (UNCHANGED)
// ===============================================



export const getUserProductByIdService = async (productId) => {
  let product = await Product.findOne({
    _id: productId,
    status: "Approved",
  })
    .populate("category", "name")
    .populate("user", "firstName lastName email")
    .lean();

  // ✅ If not found in ADMIN products, check USER products
  if (!product) {
    product = await UserProduct.findOne({
      _id: productId,
      status: "Approved",
    })
      .populate("category", "name")
      .populate("user", "firstName lastName email")
      .lean();
  }

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};



export const getAllApprovedProductsService = async () => {
  return await Product.find(
    { status: "Approved" },
    "name cost status reason image category user createdAt"
  )
    .populate("category", "name")
    .populate("user", "firstName lastName profileImage")
    .sort({ createdAt: -1 })
    .lean();
};


export const getApprovedProductsByCategoryService = async (categoryId, user) => {
  let filter = { category: categoryId };

  if (user.userType === "User") {
    filter.status = { $in: ["Pending", "Approved"] };
  }

  return await Product.find(
    filter,
    "name cost status reason image category user createdAt"
  )
    .populate("category", "name")
    .populate("user", "firstName lastName profileImage")
    .sort({ createdAt: -1 })
    .lean();
};


export const deleteUserProductService = async (productId, userId) => {
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");
  if (product.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You can delete only your own product");
  }

  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
};
