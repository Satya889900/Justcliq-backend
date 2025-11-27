// controllers/productVendor.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as service from "../services/productVendor.service.js";
import { validate } from "../middlewares/validate.js";
import { getProductVendorsSchema,
       createProductVendorSchema,
 } from "../validations/productVendor.validation.js";
import UserProduct from "../models/userProduct.model.js";

// GET all product vendors
export const getProductVendorsController =[
    validate(getProductVendorsSchema,"body"), 
asyncHandler(async (req, res) => {
// console.log(res);
  const vendors = await service.fetchProductVendorsService();
  res.json(new ApiResponse(200, vendors, "Product vendors fetched successfully"));
})
];

// Admin action to create/update product vendor entry
export const createProductVendorController = [
  validate(createProductVendorSchema, "body"),
  asyncHandler(async (req, res) => {
    const { productId } = req.params; // get from route
     const { action, reason } = req.body;
    const vendor = await service.createProductVendorService({ productId, action, reason });
    res.json(new ApiResponse(201, vendor, "Product vendor action saved successfully"));
  }),
];
// Update User Product status (Approve / Disapprove / Block)
export const updateVendorAction = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action, reason } = req.body;

    const validActions = ["Approved", "Disapproved", "Block", "Pending"];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    const userProduct = await UserProduct.findById(productId);

    if (!userProduct) {
      return res.status(404).json({
        success: false,
        message: "User product not found",
        errors: ["User Product not found"],
      });
    }

    userProduct.status = action;
    userProduct.reason = reason || "";
    await userProduct.save();

    return res.status(200).json({
      success: true,
      message: "User product action updated successfully",
      data: userProduct,
    });
  } catch (error) {
    console.error("Vendor action error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [error.message],
    });
  }
};
