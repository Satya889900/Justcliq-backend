import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: "" }, // image URL
  userType: { type: String, enum: ["Admin", "User"], default: "User" }, // track creator type
  createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: "userType" }, // Admin or User ID
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Category", categorySchema);
