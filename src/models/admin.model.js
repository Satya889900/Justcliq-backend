import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'Admin', enum: ['Admin'], required: true },
  address: { type: String, required: true },
  profileImage: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
    return next(error); // Pass error to the next middleware
  }
});

// Generate JWT auth token
adminSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, userType: this.userType },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }
  );
};

// Generate JWT refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, userType: this.userType },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

export default mongoose.model('Admin', adminSchema);

