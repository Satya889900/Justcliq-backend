// controllers/productVendor.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as service from "../services/productVendor.service.js";
import { validate } from "../middlewares/validate.js";
import { getProductVendorsSchema,
       createProductVendorSchema,
 } from "../validations/productVendor.validation.js";

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

