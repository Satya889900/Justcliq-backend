import { ApiError } from "../utils/ApiError.js";
import {
  createUser,
  findUserByEmail,
  findUserByPhone,
  saveUserOtp,
  clearUserOtp,
  saveRefreshToken,
  findUserById,
  updateUserProfile,
  deleteUserById,
} from "../repository/user.repository.js";


/* ==========================================================
   GET USER PROFILE SERVICE
========================================================== */
export const getUserProfileService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};


/* ==========================================================
   UPDATE USER PROFILE SERVICE
========================================================== */
export const updateUserProfileService = async (userId, updateData, file) => {
  
  const allowedFields = [
    "firstName",
    "lastName",
    "businessName",
    "email",
    "phone",
    "address",
    "addressLink",
    "profileImage",
  ];

  const safeData = {};

  // Only allow editable fields
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      safeData[field] = updateData[field];
    }
  });

  // Handle profile image upload
  if (file) {
    safeData.profileImage = file.path;
  }

  const updatedUser = await updateUserProfile(userId, safeData);

  if (!updatedUser) throw new ApiError(404, "User not found");

  return updatedUser;
};


/* ==========================================================
   OTP GENERATOR (4 DIGIT)
========================================================== */
const generateOtp = () =>
  Math.floor(1000 + Math.random() * 9000).toString();


/* ==========================================================
   REGISTER USER SERVICE
========================================================== */
export const registerUser = async (userData) => {
  const { firstName, lastName, email, phone } = userData;

  // Check email duplicate
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new ApiError(409, "Email already registered");
  }

  // Check phone duplicate
  const existingPhone = await findUserByPhone(phone);
  if (existingPhone) {
    throw new ApiError(409, "Phone number already registered");
  }

  // Create new user
  const newUser = await createUser({
    firstName,
    lastName,
    email,
    phone,
    businessName: "",
    address: "",
    addressLink: "",
    profileImage: "",
    userType: "User",
  });

  // Generate tokens
  const accessToken = newUser.generateAuthToken();
  const refreshToken = newUser.generateRefreshToken();

  // Save refresh token
  newUser.refreshToken = refreshToken;
  await newUser.save();

  return { newUser, accessToken, refreshToken };
};


/* ==========================================================
   REQUEST OTP SERVICE
========================================================== */
export const requestOtpService = async (phone) => {
  if (!phone) throw new ApiError(400, "Phone number is required");

  const user = await findUserByPhone(phone);
  if (!user) throw new ApiError(404, "User not found with this phone");

  const otp = generateOtp();
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  await saveUserOtp(phone, otp, otpExpiry);

  return { phone, otp }; // For testing only
};


/* ==========================================================
   OTP LOGIN SERVICE
========================================================== */
export const loginWithOtpService = async (phone, otp) => {
  console.log("🚀 OTP Login:", phone, otp);

  if (!phone || !otp)
    throw new ApiError(400, "Phone and OTP are required");

  const user = await findUserByPhone(phone);
  if (!user) throw new ApiError(404, "User not found");

  // Validate OTP
  if (
    !user.otp ||
    user.otp !== otp ||
    !user.otpExpiry ||
    Date.now() > user.otpExpiry
  ) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  // Clear OTP after login
  await clearUserOtp(phone);

  // Tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  await saveRefreshToken(user._id, refreshToken);

  return { user, accessToken, refreshToken };
};


/* ==========================================================
   DELETE USER SERVICE
========================================================== */
export const deleteUserService = async (userId) => {
  const user = await deleteUserById(userId);

  if (!user) throw new ApiError(404, "User not found");

  return user;
};
