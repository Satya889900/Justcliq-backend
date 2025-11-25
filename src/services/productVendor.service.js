

import Product from "../models/product.model.js";
import User from "../models/user.model.js"; // Keep this
import Admin from "../models/admin.model.js";
import * as repo from "../repository/productVendor.repository.js";
import { calculateAverageRating } from "../utils/rating.utils.js";


/* ============================================================
   GET ALL PRODUCT VENDORS (ADMIN PANEL LIST)
============================================================ */
export const getAllProductVendors = async () => {
  const result = await UserProduct.aggregate([
    { $match: { userType: "User" } },
    { $sort: { createdAt: -1 } },

    // Join User Details
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },

    // Join Vendor Action
    {
      $lookup: {
        from: "productvendors",
        let: { productId: "$_id", userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$user", "$$userId"] },
                ],
              },
            },
          },
          { $project: { action: 1, reason: 1, _id: 0 } },
        ],
        as: "vendorData",
      },
    },

    // Add Custom Fields
    {
      $addFields: {
        action: { $arrayElemAt: ["$vendorData.action", 0] },
        reason: { $arrayElemAt: ["$vendorData.reason", 0] },
        shopName: {
          $concat: [
            { $ifNull: ["$userData.firstName", "Unknown"] },
            " ",
            { $ifNull: ["$userData.lastName", "Vendor"] },
          ],
        },
      },
    },

    // Final output format
    {
      $project: {
        productId: "$_id",
        productType: "$name",
        cost: 1,
        shopName: 1,
        action: 1,
        reason: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return result || [];
};


/* ============================================================
   FETCH ALL VENDOR PRODUCTS
============================================================ */
export const fetchProductVendorsService = async () => {
  return await repo.getAllProductVendors();
};



/* ============================================================
   CREATE / UPDATE VENDOR ACTION (Approve, Reject, Block)
============================================================ */
export const createProductVendorService = async ({ productId, action, reason }) => {
  
  // Fetch user product
  const product = await Product.findById(productId)
    .populate("user", "firstName lastName userType");

  if (!product) throw new Error("Product not found");

  const userId = product.user._id;

  // Check existing vendor entry
  let vendor = await repo.findVendorByProductAndUser(productId, userId);

  const vendorData = {
    productId: product._id,
    shopName:
      `${product.user?.firstName || ""} ${product.user?.lastName || ""}`.trim() ||
      "Unknown Vendor",
    productType: product.name,
    cost: product.cost,
    action,
    reason,
    user: product.user._id,
    userType: product.user.userType,
  };

  // Create or Update vendor action
  if (vendor) {
    vendor = await repo.updateVendor(vendor._id, { action, reason });
  } else {
    vendor = await repo.createProductVendor(vendorData);
  }

  // ⭐⭐⭐ CRITICAL FIX: UPDATE USER PRODUCT STATUS ⭐⭐⭐
  await Product.findByIdAndUpdate(
    productId,
    { status: action }, // "Approved" / "Rejected" / "Blocked"
    { new: true }
  );

  return vendor;
};
