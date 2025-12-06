// import jwt from "jsonwebtoken";
// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import Admin from "../models/admin.model.js";
// import User from "../models/user.model.js";

// // Middleware to verify JWT and check allowed roles (optional)
// export const verifyJWT = (allowedRoles = []) => {
//   return asyncHandler(async (req, res, next) => {
//     try {
//       // Get token from cookies or Authorization header
//       const rawAuthHeader = req.headers["authorization"];
//       const headerToken = rawAuthHeader?.startsWith("Bearer ")
//         ? rawAuthHeader.replace("Bearer ", "")
//         : null;

//       const token = req.cookies?.accessToken || headerToken;
//       console.log("Verfy Toke Called", token);
//       if (!token) {
//         throw new ApiError(401, "Unauthorized request: No token provided");
//       }

//       // Verify JWT token
//       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//       // Find user in Admin or User collection
//       let user;
//       if (decodedToken.userType === "User") {
//         user = await User.findById(decodedToken._id).select("-refreshToken");
//       } else {
//         user = await Admin.findById(decodedToken._id).select(
//           "-password -refreshToken"
//         );
//       }

//       if (!user) {
//         throw new ApiError(401, "Invalid access token: User not found");
//       }

//       // Check role if specific roles required
//       if (allowedRoles.length && !allowedRoles.includes(user.userType)) {
//         throw new ApiError(403, "Forbidden: Insufficient role permissions");
//       }

//       // Attach user to request
//       req.user = user;
//       next();
//     } catch (error) {
//       throw new ApiError(401, error?.message || "Invalid access token");
//     }
//   });
// };


import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

export const verifyJWT = (allowedRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const rawAuthHeader = req.headers["authorization"];
      const headerToken = rawAuthHeader?.startsWith("Bearer ")
        ? rawAuthHeader.replace("Bearer ", "")
        : null;

      const token = req.cookies?.accessToken || headerToken;
      if (!token) throw new ApiError(401, "Unauthorized request: No token provided");

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

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

      // ⛔ BLOCK USER AFTER LOGOUT
      if (user.isLoggedOut) {
        throw new ApiError(401, "Session expired. Please login again.");
      }

      // ⛔ BLOCK TOKEN ISSUED BEFORE LOGOUT
      if (
        user.tokenInvalidBefore &&
        decodedToken.iat * 1000 < new Date(user.tokenInvalidBefore).getTime()
      ) {
        throw new ApiError(401, "Session expired. Please login again.");
      }

      // Role check
      if (allowedRoles.length && !allowedRoles.includes(user.userType)) {
        throw new ApiError(403, "Forbidden: Insufficient permissions");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  });
};
