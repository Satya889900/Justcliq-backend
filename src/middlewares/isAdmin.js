import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.userType !== "Admin") {
    return next(new ApiError(403, "Forbidden: Admin access only"));
  }
  next();
};
