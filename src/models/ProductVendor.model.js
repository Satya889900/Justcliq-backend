// models/ProductVendor.model.js
import mongoose from "mongoose";

const productVendorSchema = new mongoose.Schema({
   productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  }, // Link to the product
  shopName: { type: String, required: true, trim: true, maxlength: 100 },
  productType: { type: String, required: true, trim: true, maxlength: 100 },
  cost: { type: Number, required: true, min: 0 },
  action: { type: String, enum: ["Approved", "Disapproved", "Block", "Dropdown"], default: "Dropdown" },
  reason: { type: String, trim: true, maxlength: 500 },
  user: { type: mongoose.Schema.Types.ObjectId, refPath: "userType", required: true },
  userType: { type: String, required: true, enum: ["User", "Admin"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProductVendor = mongoose.model("ProductVendor", productVendorSchema);
export default ProductVendor;
