// Import custom error handler and utility for async middleware
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Import jwt for token verification and the User model
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

// Middleware to verify JWT and attach user to the request object
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        // Try to get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If token is not present, throw unauthorized error
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user from the decoded token's _id, exclude sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If user doesn't exist in DB, throw error
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach user data to the request object for downstream use
        req.user = user;

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        // On any failure, throw a custom unauthorized error
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});




// Role-based middleware to restrict access based on user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Current User Role:", req.user?.role);  // 🐞 Debug log
    console.log("Allowed Roles:", roles);

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};

