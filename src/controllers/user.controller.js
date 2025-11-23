// // user.controller.js

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// import {
//   registerUser,
//   requestOtpService,
//   loginWithOtpService,
//   getUserProfileService,
//   updateUserProfileService,
//   deleteUserService
// } from "../services/user.service.js";

// import {
//   requestOtpSchema,
//   loginWithOtpSchema,
//   registerUserSchema,
//   updateUserProfileSchema,
// } from "../validations/user.validation.js";

// import { validate } from "../middlewares/validate.js";
// import User from "../models/user.model.js";

// /* ======================================================
//    SAVE USER DIRECTLY FROM /user/request  (NO OTP)
//    With phone + email duplicate check
// ====================================================== */

// export const saveRequestUser = asyncHandler(async (req, res) => {
//   const { firstName, lastName, email, phone } = req.body;

//   // Required fields check
//   if (!firstName || !lastName || !phone) {
//     throw new ApiError(400, "First name, last name and phone are required");
//   }

//   // Check duplicate phone
//   const existingPhone = await User.findOne({ phone });
//   if (existingPhone) {
//     throw new ApiError(409, "User with this phone already exists");
//   }

//   // Check duplicate email (if provided)
//   if (email) {
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       throw new ApiError(409, "User with this email already exists");
//     }
//   }

//   // Create new user
//   const newUser = await User.create({
//     firstName,
//     lastName,
//     email: email || null,
//     phone,
//     userType: "User",
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, newUser, "User saved successfully"));
// });


// /* ======================================================
//    GET PROFILE
// ====================================================== */
// export const getProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const user = await getUserProfileService(userId);

//   return res.json(
//     new ApiResponse(200, user, "User profile fetched successfully")
//   );
// });

// /* ======================================================
//    UPDATE PROFILE
// ====================================================== */

// export const updateProfile = [
//   validate(updateUserProfileSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const updatedUser = await updateUserProfileService(userId, req.body, req.file);

//     return res.json(
//       new ApiResponse(200, updatedUser, "User profile updated successfully")
//     );
//   }),
// ];

// /* ======================================================
//    DELETE ACCOUNT
// ====================================================== */

// export const deleteUserAccount = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const deletedUser = await deleteUserService(userId);

//   return res.json(
//     new ApiResponse(200, deletedUser, "User account deleted successfully")
//   );
// });

// /* ======================================================
//    REQUEST OTP
// ====================================================== */

// export const requestOtp = [
//   validate(requestOtpSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const { phone } = req.body;
//     const { otp } = await requestOtpService(phone);

//     return res.json(
//       new ApiResponse(200, { phone, otp }, "OTP generated successfully")
//     );
//   }),
// ];

// /* ======================================================
//    LOGIN WITH OTP
// ====================================================== */

// export const login = [
//   validate(loginWithOtpSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const { phone, otp } = req.body;

//     const { user, accessToken, refreshToken } = await loginWithOtpService(phone, otp);

//     const safeUser = {
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       phone: user.phone,
//       userType: user.userType,
//       profileImage: user.profileImage,
//     };

//     return res.json(
//       new ApiResponse(
//         200,
//         { user: safeUser, accessToken, refreshToken },
//         "Login successful"
//       )
//     );
//   }),
// ];

// /* ======================================================
//    REGISTER USER
// ====================================================== */

// export const register = [
//   validate(registerUserSchema, "body"),
//   asyncHandler(async (req, res) => {
//     const userData = req.body;

//     const { newUser, accessToken, refreshToken } = await registerUser(userData, req.file);

//     const safeUser = {
//       _id: newUser._id,
//       firstName: newUser.firstName,
//       lastName: newUser.lastName,
//       email: newUser.email,
//       phone: newUser.phone,
//       userType: newUser.userType,
//       profileImage: newUser.profileImage,
//     };

//     return res.status(201).json(
//       new ApiResponse(
//         201,
//         { user: safeUser, accessToken, refreshToken },
//         "User registered successfully"
//       )
//     );
//   }),
// ];

// user.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {
  registerUser,
  requestOtpService,
  loginWithOtpService,
  getUserProfileService,
  updateUserProfileService,
  deleteUserService
} from "../services/user.service.js";

import {
  requestOtpSchema,
  loginWithOtpSchema,
  registerUserSchema,
  updateUserProfileSchema,
} from "../validations/user.validation.js";

import { validate } from "../middlewares/validate.js";
import User from "../models/user.model.js";

/* ======================================================
   SAVE USER DIRECTLY FROM /user/request  (NO OTP)
   With phone + email duplicate check
====================================================== */

export const saveRequestUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !phone) {
    throw new ApiError(400, "First name, last name and phone are required");
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) throw new ApiError(409, "Phone already exists");

  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new ApiError(409, "Email already exists");
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email: email || null,
    phone,
    userType: "User",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User saved successfully"));
});

/* ======================================================
   GET PROFILE
====================================================== */

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfileService(req.user._id);
  return res.json(
    new ApiResponse(200, user, "User profile fetched successfully")
  );
});

/* ======================================================
   UPDATE PROFILE
====================================================== */

export const updateProfile = [
  validate(updateUserProfileSchema, "body"),
  asyncHandler(async (req, res) => {
    const updatedUser = await updateUserProfileService(
      req.user._id,
      req.body,
      req.file
    );

    return res.json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
  }),
];

/* ======================================================
   DELETE ACCOUNT
====================================================== */

export const deleteUserAccount = asyncHandler(async (req, res) => {
  const deletedUser = await deleteUserService(req.user._id);
  return res.json(
    new ApiResponse(200, deletedUser, "User deleted successfully")
  );
});

/* ======================================================
   REQUEST OTP
====================================================== */

export const requestOtp = [
  validate(requestOtpSchema, "body"),
  asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const { otp } = await requestOtpService(phone);

    return res.json(
      new ApiResponse(200, { phone, otp }, "OTP generated successfully")
    );
  }),
];

/* ======================================================
   LOGIN WITH OTP
====================================================== */

export const login = [
  validate(loginWithOtpSchema, "body"),
  asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    const { user, accessToken, refreshToken } = await loginWithOtpService(
      phone,
      otp
    );

    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      profileImage: user.profileImage,
    };

    return res.json(
      new ApiResponse(
        200,
        { user: safeUser, accessToken, refreshToken },
        "Login successful"
      )
    );
  }),
];

/* ======================================================
   REGISTER USER
====================================================== */

export const register = [
  validate(registerUserSchema, "body"),
  asyncHandler(async (req, res) => {
    const userData = req.body;

    const { newUser, accessToken, refreshToken } = await registerUser(userData);

    const safeUser = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      userType: newUser.userType,
    };

    return res.status(201).json(
      new ApiResponse(
        201,
        { user: safeUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );
  }),
];
