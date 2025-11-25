import mongoose from "mongoose";

const allowedUnits = ["quantity", "kg", "liters"];

const userProductSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },

  cost: { type: Number, required: true },

  // ❌ No description field for User Products
  // description: not present intentionally

  image: { type: String, required: true },

  unit: {
    type: String,
    enum: allowedUnits,
    required: true,
  },

  // Dynamic numeric fields (same logic)
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

  // 🔗 User who added this product
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
  type: String,
  enum: ["Pending", "Approved", "Rejected"],
  default: "Pending",
},

userType: {
  type: String,
  enum: ["User"],
  required: true,
},


  createdAt: { type: Date, default: Date.now },
});

export { allowedUnits };
export default mongoose.model("UserProduct", userProductSchema);
