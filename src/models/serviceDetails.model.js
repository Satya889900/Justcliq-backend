// models/serviceDetails.model.js
import mongoose from 'mongoose';

const serviceDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  typeOfService: { type: String, required: true },
  cost: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Approved', 'Disapproved', 'Suspended'],
    default: 'Disapproved',
  },
  ratings: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    default: [],
  },
  reason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const ServiceDetails = mongoose.model('ServiceDetails', serviceDetailsSchema);
export default ServiceDetails;
