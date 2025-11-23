// repositories/user.repository.js
import User from '../models/user.model.js';

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByPhone = async (phone) => {
  return await User.findOne({ phone });
};

// Save OTP + expiry
export const saveUserOtp = async (phone, otp, otpExpiry) =>
  await User.findOneAndUpdate({ phone }, { otp, otpExpiry }, { new: true });

// Clear OTP after verification
export const clearUserOtp = async (phone) =>
  await User.findOneAndUpdate({ phone }, { otp: null, otpExpiry: null }, { new: true });

// Save refresh token
export const saveRefreshToken = async (userId, refreshToken) =>
  await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

// Get user by ID
export const findUserById = async (id) => {
  return await User.findById(id).select("-refreshToken -otp -otpExpiry");
};

// Update user profile
export const updateUserProfile = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
    "-refreshToken -otp -otpExpiry"
  );
};

export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};
