// // services/admin/admin.service.js
// import { ApiError } from '../utils/ApiError.js';
// import { findAdminById, findAdminByIdUserType,findAdminByIdWithRefresh, updateAdminRefreshToken } from '../repository/admin.repository.js';
// import { findUserById } from "../repository/user.repository.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import Admin from "../models/admin.model.js";
// /**
//  * Get admin profile by ID
//  * @param {String} adminId
//  * @returns {Object} Admin profile
//  */
// export const getAdminProfileService = async (adminId) => {
//   const admin = await findAdminById(adminId);
//   if (!admin) {
//     throw new ApiError(404, 'Admin not found');
//   }
//   return admin;
// };

// //  * Get current user info by ID and type
// //  * @param {String} userId
// //  * @param {String} userType - 'Admin' or 'User'
// //  */
// export const getCurrentUserService = async (userId, userType) => {
//   let user;

//   if (userType === "Admin") {
//     user = await findAdminByIdUserType(userId);
//   } else {
//     user = await findUserById(userId);
//   }

//   if (!user) {
//     throw new ApiError(404, `${userType} not found`);
//   }

//   return user;
// };

// export const refreshAccessTokenService = async (refreshToken) => {
//   if (!refreshToken) {
//     throw new ApiError(401, "Refresh token required");
//   }

//   let decoded;
//   try {
//     decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//   } catch (err) {
//     throw new ApiError(403, "Invalid or expired refresh token");
//   }

//   const admin = await findAdminByIdWithRefresh(decoded._id);
//   if (!admin || admin.refreshToken !== refreshToken) {
//     throw new ApiError(403, "Refresh token not valid");
//   }

//   // generate new tokens
//   const newAccessToken = admin.generateAuthToken();
//   const newRefreshToken = admin.generateRefreshToken();

//   // update in DB
//   await updateAdminRefreshToken(admin._id, newRefreshToken);

//   return { newAccessToken, newRefreshToken };
// };

// export const updateAdminService = async (adminId, updateData) => {
//   const admin = await Admin.findById(adminId);
//   if (!admin) throw new ApiError(404, "Admin not found");

//   if (updateData.firstName) admin.firstName = updateData.firstName;
//   if (updateData.lastName) admin.lastName = updateData.lastName;
//   if (updateData.email) admin.email = updateData.email;
//   if (updateData.phone) admin.phone = updateData.phone;
//   if (updateData.address) admin.address = updateData.address;
//   if (updateData.profileImage) admin.profileImage = updateData.profileImage; // Save the image URL

//   // Hash new password if provided
//   if (updateData.password) {
//     admin.password = await bcrypt.hash(updateData.password, 10);
//   }

//   await admin.save();

//   return {
//     _id: admin._id,
//     firstName: admin.firstName,
//     lastName: admin.lastName,
//     email: admin.email,
//     phone: admin.phone,
//     address: admin.address,
//     profileImage: admin.profileImage, // Return the new image URL
//   };
// };

// services/admin/admin.service.js
import { ApiError } from "../utils/ApiError.js";
import {
  findAdminById,
  findAdminByIdUserType,
  findAdminByIdWithRefresh,
  updateAdminRefreshToken,
} from "../repository/admin.repository.js";
import { findUserById } from "../repository/user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/admin.model.js";

// Get admin profile
export const getAdminProfileService = async (adminId) => {
  const admin = await findAdminById(adminId);
  if (!admin) throw new ApiError(404, "Admin not found");
  return admin;
};

// Get current user
export const getCurrentUserService = async (userId, userType) => {
  let user;

  if (userType === "Admin") user = await findAdminByIdUserType(userId);
  else user = await findUserById(userId);

  if (!user) throw new ApiError(404, `${userType} not found`);

  return user;
};

// Refresh access token
export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, "Refresh token required");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(403, "Invalid or expired refresh token");
  }

  const admin = await findAdminByIdWithRefresh(decoded._id);
  if (!admin || admin.refreshToken !== refreshToken)
    throw new ApiError(403, "Refresh token not valid");

  const newAccessToken = admin.generateAuthToken();
  const newRefreshToken = admin.generateRefreshToken();

  await updateAdminRefreshToken(admin._id, newRefreshToken);

  return { newAccessToken, newRefreshToken };
};

// ⭐ UPDATE ADMIN SERVICE
export const updateAdminService = async (adminId, updateData) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(404, "Admin not found");

  // Update plain fields
  if (updateData.firstName) admin.firstName = updateData.firstName;
  if (updateData.lastName) admin.lastName = updateData.lastName;
  if (updateData.email) admin.email = updateData.email;
  if (updateData.phone) admin.phone = updateData.phone;
  if (updateData.address) admin.address = updateData.address;

  // ⭐ IMPORTANT: PROFILE IMAGE FIX
  if (updateData.profileImage || updateData.filePath) {
    let file = updateData.profileImage || updateData.filePath;

    // 🔥 IMPORTANT — Ensure URL starts with "/"
    if (!file.startsWith("/")) file = file;

    admin.profileImage = file;
  }

  // ⭐ Hash password if updated
  if (updateData.password) {
    admin.password = await bcrypt.hash(updateData.password, 10);
  }

  await admin.save();

  return {
    _id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone,
    address: admin.address,
    profileImage: admin.profileImage,
  };
};
