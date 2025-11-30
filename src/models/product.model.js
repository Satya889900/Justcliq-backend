// models/product.model.js
import mongoose from "mongoose";

const allowedUnits = ["quantity", "kg", "liters"]; // ✅ Enum values

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
      enum: allowedUnits,
      required: true,
    },

    // Dynamic numeric fields
    quantity: {
      type: Number,
      required: function () {
        return this.unit === "quantity";
      },
    },
    weight: {
      type: Number,
      required: function () {
        return this.unit === "kg";
      },
    },
    volume: {
      type: Number,
      required: function () {
        return this.unit === "liters";
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
      index: true, // 🔥 fast filter by user
    },

    userType: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
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

export { allowedUnits };
export default mongoose.model("Product", productSchema);
