import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/user.model.js';
import {
  registerUserSchema,
  loginWithOtpSchema,
} from '../validations/user.validation.js';

/**
 * @description Generate access and refresh tokens for a user
 * @param {string} userId
 * @returns {{accessToken: string, refreshToken: string}}
 */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating tokens',
      error.message
    );
  }
};

/**
 * @route POST /api/v1/users/register
 * @description Register a new user
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  // Validate request body against Joi schema
  const { error, value } = registerUserSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { phone, firstName, lastName, email } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new ApiError(409, 'User with this phone number already exists.');
  }

  // Create new user
  const user = await User.create({
    phone,
    firstName,
    lastName,
    email: email || null, // Ensure email is null if not provided
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully.'));
});

/**
 * @route POST /api/v1/users/login
 * @description Login user with phone and OTP
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = loginWithOtpSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { phone, otp } = value;

  // Using static OTP as requested
  if (otp !== '123456') {
    throw new ApiError(401, 'Invalid OTP');
  }

  // Find user by phone
  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(404, 'User with this phone number does not exist.');
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});
