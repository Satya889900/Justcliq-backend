// services/productVendor.service.js
import * as repo from "../repository/productVendor.repository.js";
import Product from "../models/product.model.js";
import ProductVendor from "../models/ProductVendor.model.js";

export const getAllProductVendors = async () => {
   // Use aggregation to join ProductVendor
 const result = await Product.aggregate([
    { $match: { userType: "User" } }, // only user products
    { $sort: { createdAt: -1 } }, // latest product first
    { $limit: 1 }, // only 1 product

    // Join with User
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },

    // Join with ProductVendor to get action & reason
    {
      $lookup: {
        from: "productvendors",
        let: { productId: "$_id", userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$productId", "$$productId"] }, { $eq: ["$user", "$$userId"] }] },
            },
          },
          { $project: { action: 1, reason: 1, _id: 0 } },
        ],
        as: "vendorData",
      },
    },

    // Flatten action & reason
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

    {
      $project: {
        // _id: 0,
        productId: "$_id",
        productType: "$name",
        cost: 1,
        shopName: 1,
        // userType: 1,
        action: 1,
        reason: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return result[0] || null;
};

export const createProductVendor = async (data) => {
  const vendor = new ProductVendor(data);
  return await vendor.save();
};

export const updateVendor = async (vendorId, updateData) => {
  return await ProductVendor.findByIdAndUpdate(
    vendorId,
    { ...updateData, updatedAt: Date.now() },
    { new: true }
  );
};

export const findVendorByProductAndUser = async (productId, userId) => {
  return await ProductVendor.findOne({ productId, user: userId });
};

