// import jwt from 'jsonwebtoken';
// import { ApiError } from '../utils/ApiError.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import Admin from '../models/admin.model.js';
// import User from '../models/user.model.js';

// // Middleware to verify JWT and check user type
// export const verifyJWT = (allowedRoles = []) => {
//   return asyncHandler(async (req, res, next) => {
//     try {
//       // Get token from cookies or Authorization header
//       const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
//      const date=new Date();
//       console.log(date);
//       console.log(date.getHours()+":"+date.getMinutes());
//       console.log("🚀 ~ returnasyncHandler ~ req.headers['authorization']:", req.headers['authorization']);
//       console.log("🚀 ~ returnasyncHandler ~ req.cookies?.accessToken:", req.cookies?.accessToken);
//       console.log("🚀 ~ returnasyncHandler ~ token:", token);
 
//       if (!token) {
//         throw new ApiError(401, 'Unauthorized request: No token provided');
//       }

//       // Verify JWT token
//       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       console.log("🚀 ~ returnasyncHandler ~ process.env.ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);

//       // Find user in Admin or User collection
//       let user;
//       if (decodedToken.userType === 'User') {
//         user = await User.findById(decodedToken._id).select('-refreshToken');
//       } else {
//         user = await Admin.findById(decodedToken._id).select('-password -refreshToken');
//       }
//       console.log("🚀 ~ user ~ user:", user);

//       if (!user) {
//         throw new ApiError(401, 'Invalid access token: User not found');
//       }

//       // Check if userType is allowed (if allowedRoles is provided)
//       if (allowedRoles.length && !allowedRoles.includes(user.userType)) {
//         throw new ApiError(403, 'Forbidden: Insufficient role permissions');
//       }

//       // Attach user to request
//       req.user = user;
//       next();
//     } catch (error) {
//       throw new ApiError(401, error?.message || 'Invalid access token');
//     }
//   });
// };

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

// Middleware to verify JWT and check allowed roles (optional)
export const verifyJWT = (allowedRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // Get token from cookies or Authorization header
      const rawAuthHeader = req.headers["authorization"];
      const headerToken = rawAuthHeader?.startsWith("Bearer ")
        ? rawAuthHeader.replace("Bearer ", "")
        : null;

      const token = req.cookies?.accessToken || headerToken;
      console.log("Verfy Toke Called", token);
      if (!token) {
        throw new ApiError(401, "Unauthorized request: No token provided");
      }

      // Verify JWT token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Find user in Admin or User collection
      let user;
      if (decodedToken.userType === "User") {
        user = await User.findById(decodedToken._id).select("-refreshToken");
      } else {
        user = await Admin.findById(decodedToken._id).select(
          "-password -refreshToken"
        );
      }

      if (!user) {
        throw new ApiError(401, "Invalid access token: User not found");
      }

      // Check role if specific roles required
      if (allowedRoles.length && !allowedRoles.includes(user.userType)) {
        throw new ApiError(403, "Forbidden: Insufficient role permissions");
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  });
};
