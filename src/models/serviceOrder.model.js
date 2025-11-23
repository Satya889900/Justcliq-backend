/*serviceOrder.model.js*/

import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema({
  // Unique identifier for the service order
  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  // Reference to the service that was ordered
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },

  // Reference to the user who placed the order
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Reference to the assigned service provider or admin
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'serviceProviderType', // Dynamic reference
    required: false, // It's optional until a vendor is assigned
  },

  // The model name for the serviceProvider reference
  serviceProviderType: {
    type: String,
    required: false,
    enum: ["User", "Admin"], // Can be a User (as ServiceProvider) or an Admin
  },

  // Status of the service order
  status: {
    type: String,
    required: true,
    enum: ["Upcoming", "Scheduled", "Ongoing", "Completed", "Cancelled"],
    default: "Upcoming",
  },

  // Date and time the service was requested
  availedOn: {
    type: Date,
    required: true,
  },

  // Date and time the service was completed (optional)
  completedOn: {
    type: Date,
    default: null,
  },

  // Any notes or special instructions for the service
  notes: {
    type: String,
    default: "",
  },

  // Automatically generated timestamp for creation
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ServiceOrder", serviceOrderSchema);