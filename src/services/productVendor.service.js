import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import * as repo from "../repository/productVendor.repository.js";
import { calculateAverageRating } from "../utils/rating.utils.js";

export const fetchProductVendorsService = async () => {
  const products = await repo.getAllProductVendors();

return products;
};


export const createProductVendorService = async ({ productId, action, reason }) => {
  // Fetch product to get details
  const product = await Product.findById(productId).populate("user", "firstName lastName userType");
  if (!product) throw new Error("Product not found");

  
  const userId = product.user._id;

  // Check if vendor entry already exists
  let vendor = await repo.findVendorByProductAndUser(productId, userId);
  const vendorData = {
     productId: product._id, // include product ID
    shopName: `${product.user?.firstName || ""} ${product.user?.lastName || ""}`.trim() || "Unknown Vendor",
    productType: product.name,
    cost: product.cost,
    action,
    reason,
    user: product.user._id,
    userType: product.user.userType,
  };

  if (vendor) {
    // Update existing
    vendor = await repo.updateVendor(vendor._id, { action, reason });
  } else {
     vendor=await repo.createProductVendor(vendorData);
  }
  return vendor;
};