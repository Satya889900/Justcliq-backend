// models/productCategory.model.js
import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: "" }, // Image URL
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType'
  }, // Reference to creator (Admin/User)
  userType: { 
    type: String, 
    enum: ['Admin', 'User']
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ProductCategory", productCategorySchema);
 