/*productOrder.model.js*/

import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema({
  // Reference to the product being ordered
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  
  // ✅ Updated vendor field to support both User and Admin
  // Reference to the vendor who provides the product
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'vendorType', // Dynamic reference based on the vendorType field
    required: true,
  },

  // The model name for the vendor reference
  vendorType: {
    type: String,
    required: true,
    enum: ["User", "Admin"], // Vendor can be a User or an Admin
  },
  
  // Reference to the customer who placed the order
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // The name of the product at the time of order
  productName: {
    type: String,
    required: true,
  },
  
  // The quantity of the product ordered
  quantity: {
    type: String, // Stored as a string to accommodate units like "5kg"
    required: true,
  },
  
  // The cost of the product at the time of order
  cost: {
    type: Number,
    required: true,
  },
  
  // The date the order was placed
  orderedOn: {
    type: Date,
    required: true,
  },
  
  // The current status of the order
  status: {
    type: String,
    required: true,
    enum: ["Upcoming", "Out for Delivery", "Delivered", "Cancelled", "Not Delivered"],
    default: "Upcoming",
  },
 assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedByType", // dynamically reference Admin/User
      default: null,
    },
    assignedByType: {
      type: String,
      enum: ["User", "Admin", null],
      default: null,
    },
  // Automatically generated timestamp for creation
  createdAt: {
    type: Date,
    default: Date.now,
    
  },
},
{
  timestamps: true,
   toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ✅ Virtual field for vendor full name
productOrderSchema.virtual("vendorName").get(function () {
  if (this.vendor && this.vendor.firstName && this.vendor.lastName) {
    return `${this.vendor.firstName} ${this.vendor.lastName}`;
  }
  return null;
});

export default mongoose.model("ProductOrder", productOrderSchema);