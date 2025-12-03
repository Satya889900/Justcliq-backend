import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "items.productModel",   // 🔥 Dynamic model reference
  },

  productModel: {
    type: String,
    required: true,
    enum: ["UserProduct", "Product"], // 🔥 Support both models
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Cart", cartSchema);
