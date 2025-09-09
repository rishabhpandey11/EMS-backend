import { leave } from "../models/leave.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// 1️⃣ Employee submits leave request
export const submitLeaveRequest = asyncHandler(async (req, res) => {
  // Only employee role allowed
  if (req.user.role !== 'employee' || !req.user.isVerified) {
    throw new ApiError(403, "Only verified employees can submit leave requests");
  }

  const { fromDate, toDate, reason } = req.body;

  if (!fromDate || !toDate || !reason) {
    throw new ApiError(400, "fromDate, toDate and reason are required");
  }

  const parsedFrom = new Date(fromDate);
  const parsedTo = new Date(toDate);

  if (isNaN(parsedFrom.getTime()) || isNaN(parsedTo.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  if (parsedTo < parsedFrom) {
    throw new ApiError(400, "toDate must be after fromDate");
  }

  const newLeave = await leave.create({
    employee: req.user._id,
    fromDate: parsedFrom,
    toDate: parsedTo,
    reason,
  });

  return res.status(201).json(new ApiResponse(201, newLeave, "Leave request submitted successfully"));
});


// 2️⃣ Manager views all leave requests (optional: could filter by their department or all)
export const getAllLeaveRequests = asyncHandler(async (req, res) => {
  // Only manager (and admins maybe) can view all leave requests
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    throw new ApiError(403, "Only managers or admins can view leave requests");
  }

  // Populate employee and reviewedBy info
  const leaves = await leave.find({ status: 'pending' })
    .populate('employee', 'fullName email')
    .populate('reviewedBy', 'fullName email')
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, leaves, "Leave requests fetched successfully"));
});


export const updateLeaveStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'manager') {
    throw new ApiError(403, "Only managers can update leave status");
  }

  const { leaveId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(leaveId)) {
    throw new ApiError(400, "Invalid leave ID");
  }

  const validStatuses = ['approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  const leaveRequest = await leave.findById(leaveId);
  if (!leaveRequest) {
    throw new ApiError(404, "Leave request not found");
  }

  leaveRequest.status = status;
  leaveRequest.reviewedBy = req.user._id;
  // Optionally add: leaveRequest.reviewedAt = new Date();

  await leaveRequest.save();

  return res.status(200).json(new ApiResponse(200, leaveRequest, "Leave status updated successfully"));
});

// 4️⃣ Get only approved leave requests (manager or admin)
export const getApprovedLeaveRequests = asyncHandler(async (req, res) => {
  // ✅ Only manager or admin can view
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    throw new ApiError(403, "Only managers or admins can view approved leave requests");
  }

  const approvedLeaves = await leave.find({ status: 'approved' })
    .populate('employee', 'fullName email')
    .populate('reviewedBy', 'fullName email')
    .sort({ reviewedAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, approvedLeaves, "Approved leave requests fetched successfully")
  );
});

// 4️⃣ Get only approved leave requests (manager or admin)
export const getRejectedLeaveRequests = asyncHandler(async (req, res) => {
  // ✅ Only manager or admin can view
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    throw new ApiError(403, "Only managers or admins can view approved leave requests");
  }

  const rejectedLeaves = await leave.find({ status: 'rejected' })
    .populate('employee', 'fullName email')
    .populate('reviewedBy', 'fullName email')
    .sort({ reviewedAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, rejectedLeaves, "Approved leave requests fetched successfully")
  );
});