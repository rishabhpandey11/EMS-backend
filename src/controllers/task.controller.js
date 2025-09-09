import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// ========================
// 1️⃣ Manager assigns task
// ========================
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, department, dueDate } = req.body;
  const assignedBy = req.user._id;

  // ✅ Only manager can assign tasks
  if (req.user.role !== 'manager' || !req.user.isVerified) {
    throw new ApiError(403, 'Only verified managers can assign tasks');
  }

  // ✅ Validate required fields
  if (!title || !description || !assignedTo || !department || !dueDate) {
    throw new ApiError(400, "All fields are required: title, description, assignedTo, department, dueDate");
  }

  // ✅ Validate department
  const validDepartments = ['IT', 'Management', 'HR', 'Marketing'];
  if (!validDepartments.includes(department)) {
    throw new ApiError(400, "Invalid department. Valid options: IT, Management, HR, Marketing");
  }

  // ✅ Validate due date
  const parsedDueDate = new Date(dueDate);
  if (isNaN(parsedDueDate.getTime())) {
    throw new ApiError(400, "Invalid dueDate format");
  }

  // ✅ Ensure the assigned user exists and is a verified employee
  const employee = await User.findById(assignedTo);
  if (!employee || employee.role !== 'employee' || !employee.isVerified) {
    throw new ApiError(400, "Assigned user must be a verified employee");
  }

  // ✅ Create task
  const newTask = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy,
    department,
    dueDate: parsedDueDate,
  });

  return res.status(201).json(
    new ApiResponse(201, newTask, "New task assigned successfully")
  );
});

// ===================================
// 2️⃣ Employee reads their own tasks
// ===================================
export const getTasksForEmployee = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // ✅ Only employees can view this
  if (req.user.role !== 'employee' || !req.user.isVerified) {
    throw new ApiError(403, "Only verified employees can view their tasks");
  }

  const tasks = await Task.find({ assignedTo: userId })
    .populate('assignedBy', 'fullName email role')  // Populate manager details
    .sort({ dueDate: 1 });

  return res.status(200).json(
    new ApiResponse(200, tasks, "Employee tasks fetched successfully")
  );
});

// ==========================================
// 3️⃣ Employee updates status of a task
// ==========================================
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { taskId } = req.params;
  const { status } = req.body;

  // ✅ Role check
  if (req.user.role !== 'employee' || !req.user.isVerified) {
    throw new ApiError(403, "Only verified employees can update task status");
  }

  // ✅ Validate status
  const validStatuses = ['assigned', 'in progress', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value. Valid values: assigned, in progress, completed");
  }

  // ✅ Task ownership check
  const task = await Task.findOne({ _id: taskId, assignedTo: userId });
  if (!task) {
    throw new ApiError(404, "Task not found or you're not authorized to update it");
  }

  task.status = status;
  await task.save();

  return res.status(200).json(
    new ApiResponse(200, task, "Task status updated successfully")
  );
});


// =============================================
// 4️⃣ Manager fetches all tasks they assigned
// =============================================
export const getTasksAssignedByManager = asyncHandler(async (req, res) => {
  const managerId = req.user._id;

  // ✅ Only verified managers can view this
  if (req.user.role !== 'manager' || !req.user.isVerified) {
    throw new ApiError(403, "Only verified managers can view assigned tasks");
  }

  const tasks = await Task.find({ assignedBy: managerId })
    .populate('assignedTo', 'fullName email role')  // Populate employee info
    .sort({ dueDate: 1 });

  return res.status(200).json(
    new ApiResponse(200, tasks, "Tasks assigned by manager fetched successfully")
  );
});

export const getVerifiedEmployeesforTasks = asyncHandler(async (req, res) => {
  const verifiedEmployees = await User.find({
    role: 'employee',
    isVerified: true
  }).select('_id fullName email');

  return res.status(200).json(
    new ApiResponse(200, verifiedEmployees, "Verified employees fetched successfully")
  );
});


// ===============================
// 5️⃣ Fetch All Tasks for Manager
// ===============================
export const getAllTasksForManager = asyncHandler(async (req, res) => {
  const managerId = req.user._id;

  // ✅ Ensure user is a verified manager
  if (req.user.role !== 'manager' || !req.user.isVerified) {
    throw new ApiError(403, "Only verified managers can view all assigned tasks");
  }

  const tasks = await Task.find({ assignedBy: managerId })
    .populate('assignedTo', 'fullName email role')  // employee info
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, tasks, "All tasks assigned by manager fetched successfully")
  );
});

