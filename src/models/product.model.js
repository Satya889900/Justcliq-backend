// models/product.model.js
import mongoose from "mongoose";

// ✅ Enum values

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
      index: true, // 🔥 speeds up category filtering
    },

    cost: { type: Number, required: true },

    description: { type: String, default: "", trim: true },

    image: { type: String, required: true }, // single image

  unit: {
      type: String,
      required: true,
      trim: true, // e.g. box, kg, packet, liters, meter, etc
    },

    value: {
      type: Number,
      required: true,
      min: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
      index: true, // 🔥 fast filter by user
    },

     userType: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Disapproved", "Block", "Dropdown"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

/* 🔥🔥 PERFORMANCE BOOST — ADD INDEXES 🔥🔥 */
productSchema.index({ createdAt: -1 });         // fast sorting
productSchema.index({ name: "text" });          // fast searching
productSchema.index({ category: 1, createdAt: -1 }); // combined index for super fast category filter


export default mongoose.model("Product", productSchema);
