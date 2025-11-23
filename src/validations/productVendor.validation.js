// validations/productVendor.validation.js
import Joi from "joi";
import { objectId } from "./common.validation.js"; // helper for ObjectId

export const getProductVendorsSchema = Joi.object({
  userId: objectId.optional(), // optional filter by vendor userId
});


export const createProductVendorSchema = Joi.object({
  
action: Joi.string()
.valid("Approved", "Disapproved", "Block", "Dropdown").required(),
  reason: Joi.string().max(500).required(),
});