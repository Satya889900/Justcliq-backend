// repositories/admin.repository.js
import Admin from '../models/admin.model.js';

/**
 * Fetch admin by ID and return only selected fields
 * @param {String} adminId
 * @returns {Object} Admin object
 */
export const findAdminById = async (adminId) => {
  return await Admin.findById(adminId).select(
    "firstName lastName email phone address profileImage createdAt"
  );
};



export const findAdminByIdUserType = async (adminId) => {
  return await Admin.findById(adminId).select(
    '-password -refreshToken'
  );
};

export const findAdminByIdWithRefresh = async (adminId) => {
  return await Admin.findById(adminId);
};

export const updateAdminRefreshToken = async (adminId, newRefreshToken) => {
  return await Admin.findByIdAndUpdate(
    adminId,
    { refreshToken: newRefreshToken },
    { new: true }
  );
};