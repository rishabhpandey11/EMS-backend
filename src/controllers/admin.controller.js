// Importing required modules and utilities
import { User } from '../models/user.model.js';               // Mongoose model for User
import { ApiResponse } from '../utils/ApiResponse.js';       // Utility class to standardize API responses
import { asyncHandler } from "../utils/asyncHandler.js";     // Utility to handle async errors in Express
import { ApiError } from "../utils/ApiError.js";             // Custom error class for API errors

// Controller to get all users who are not verified yet
export const getUnverifiedUsers = asyncHandler(async (req, res) => {

    // Find users with isVerified set to false
    const users = await User.find({ isVerified: false });

    // Send response with list of unverified users
    return res.status(200).json(new ApiResponse(
        200,
        users,
        "Unverified users"
    ));
});

// Controller to verify a user and assign them a role
export const verifyUserAndAssignRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;   // Get userId from request parameters
    const { role } = req.body;       // Get role from request body

    // Define valid roles that can be assigned
    const validRoles = ['employee', 'manager', 'admin'];

    // If role is invalid, throw a 400 Bad Request error
    if (!validRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // If user does not exist, throw 404 Not Found error
    if (!user) throw new ApiError(404, "User not found");

    // Update user verification status and assign role
    user.isVerified = true;
    user.role = role;

    // Save updated user to database
    await user.save();

    // Send response with updated user information
    return res.status(200).json(new ApiResponse(
        200,
        user,
        `User verified & role updated to ${role}`
    ));
});

// Controller to get all users who are verified
export const getVerifiedUsers = asyncHandler(async (req, res) => {
  // Fetch users where isVerified is true
  const verifiedUsers = await User.find({ isVerified: true });

  // Respond with the list of verified users
  return res.status(200).json(new ApiResponse(
    200,
    verifiedUsers,
    "Verified users"
  ));
});
