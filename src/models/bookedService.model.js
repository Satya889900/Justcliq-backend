// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// vendor: {
//   type: mongoose.Schema.Types.ObjectId,
//   required: false,
//   refPath: 'vendorModel'
// },
// vendorModel: {
//   type: String,
//   required: false,
//   enum: ['User', 'Admin']
// },

//   bookedDate: { type: Date, required: true },
//   bookedTime: { type: String, required: true },
//     // ✅ Add status field
//   status: {
//     type: String,
//     enum: ["Upcoming", "Ongoing", "Scheduled", "Cancelled", "Completed"],
//     default: "Upcoming"
//   },
//   userCompleted: { type: Boolean, default: false },
// vendorCompleted: { type: Boolean, default: false },

// rating: {
//   score: { type: Number, min: 1, max: 5 },
//   review: { type: String }
// },


//   completedOn: { type: Date, default: null }, 
//   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
//   createdAt: { type: Date, default: Date.now },
// },
//   { timestamps: true });

// export default mongoose.model("Booking", bookingSchema);

// models/bookedService.model.js
import mongoose from "mongoose";

const bookedServiceSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      refPath: "vendorModel",
    },
    vendorModel: {
      type: String,
      required: false,
      enum: ["User", "Admin"],
    },

    bookedDate: { type: Date, required: true },
    bookedTime: { type: String, required: true },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Scheduled", "Cancelled", "Completed"],
      default: "Upcoming",
    },

    userCompleted: { type: Boolean, default: false },
    vendorCompleted: { type: Boolean, default: false },

    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: { type: String },
    },

    completedOn: { type: Date, default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("BookedService", bookedServiceSchema);
