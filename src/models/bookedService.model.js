import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
vendor: {
  type: mongoose.Schema.Types.ObjectId,
  required: false,
  refPath: 'vendorModel'
},
vendorModel: {
  type: String,
  required: false,
  enum: ['User', 'Admin']
},

  bookedDate: { type: Date, required: true },
  bookedTime: { type: String, required: true },
    // ✅ Add status field
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Scheduled", "Cancelled", "Completed"],
    default: "Upcoming"
  },

  completedOn: { type: Date, default: null }, 
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
  createdAt: { type: Date, default: Date.now },
},
  { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
