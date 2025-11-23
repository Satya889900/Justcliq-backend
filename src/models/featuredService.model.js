import mongoose from "mongoose";

const featuredServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  image: { type: String, required: true },
  imagePublicId: { type: String, default: "" },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType",
  },

  userType: {
    type: String,
    required: true,
    enum: ["Admin", "User"],
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FeaturedService", featuredServiceSchema);
