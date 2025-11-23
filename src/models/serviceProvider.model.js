/* models/serviceProvider.model.js */
import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  action: {
    type: String,
    enum: ['Pending', 'Approved', 'Disapproved', 'Suspended'],
    default: 'Pending',
    required: true,
  },
  reason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;
