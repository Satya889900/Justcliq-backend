// import mongoose from "mongoose";

// const serviceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   // description: { type: String, default: "" },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
//   cost: { type: Number,
//      default: 0,
//     required: true,
//    },
//      // Wage type and cost
//   // wageType: {
//   //   type: String,
//   //   enum: ["Hourly", "Daily"],
//   //   required: true,
//   // },

//   image: { type: String, default: "" },
//   // imagePublicId: { type: String, default: "" },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: "userType", // 👈 dynamic reference
//   },
//   userType: {
//     type: String,
//     required: true,
//     enum: ["User", "Admin"], // 👈 define allowed roles
//   },
//   createdAt: { type: Date, default: Date.now },
// });



// export default mongoose.model("Service", serviceSchema);


import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },

  description: { 
    type: String, 
    default: "" 
  },

  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },

  cost: { 
    type: Number,
    default: 0,
    required: true,
  },

wageType: {
  type: String,
  enum: ["Hourly", "Daily"],
  required: function () {
    return this.userType === "Admin";  // ✅ Only Admin must send wageType
  },
},


  image: { type: String, default: "" },

  imagePublicId: { type: String, default: "" },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType",
  },

  userType: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Service", serviceSchema);
