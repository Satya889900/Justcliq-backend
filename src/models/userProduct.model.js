import mongoose from "mongoose";

const allowedUnits = ["quantity", "kg", "liters"];

const userProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    cost: { type: Number, required: true },

    image: { type: String, required: true },

    unit: {
      type: String,
      enum: allowedUnits,
      required: true,
    },

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

    status: {
      type: String,
      enum: ["Pending", "Approved", "Disapproved", "Block"],
      default: "Pending",
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userType: {
      type: String,
      enum: ["User"],
      required: true,
    },
  },
  {
    timestamps: true, // <-- ⚡ Auto adds createdAt + updatedAt
  }
);

// ⚡ SPEED BOOST: Add indexes
userProductSchema.index({ user: 1 });
userProductSchema.index({ category: 1 });
userProductSchema.index({ status: 1 });
userProductSchema.index({ createdAt: -1 });

export { allowedUnits };
export default mongoose.model("UserProduct", userProductSchema);
