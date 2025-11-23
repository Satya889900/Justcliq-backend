import mongoose from "mongoose";

const allowedUnits = ["quantity", "kg", "liters"]; // ✅ Enum values

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory", required: true },
  cost: { type: Number, required: true },
  description: { type: String, default: "" },
  image: { type: String, required: true }, // single image
  unit: {
    type: String,
    enum: allowedUnits, // ✅ enforce enum at DB level
    required: true,
  },
  // Dynamic numeric fields
  quantity: { type: Number, required: function() { return this.unit === "quantity"; } },
  weight: { type: Number, required: function() { return this.unit === "kg"; } },
  volume: { type: Number, required: function() { return this.unit === "liters"; } },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",  // dynamic reference: can point to User or Admin
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
  },
  createdAt: { type: Date, default: Date.now },
});


export { allowedUnits };
export default mongoose.model("Product", productSchema);
