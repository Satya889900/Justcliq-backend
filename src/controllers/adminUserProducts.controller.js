import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserProduct from "../models/userProduct.model.js";

/**
 * ADMIN: GET ALL USER PRODUCTS
 */
export const adminGetAllUserProductsController = asyncHandler(async (req, res) => {
  const products = await UserProduct.find({})
    .populate("category", "name")
    .populate("user", "firstName lastName email profileImage phone")
    .sort({ createdAt: -1 })
    .lean();

  res.json(
    new ApiResponse(200, products, "All user products fetched successfully")
  );
});
