import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // manager
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // employee
  department: { type: String, enum: ['IT', 'Management', 'HR', 'Marketing'] },
  status: { type: String, enum: ['assigned', 'in progress', 'completed'], default: 'assigned' },
  assignedAt: { type: Date, default: Date.now },
  dueDate: Date,
}, { timestamps: true });


export const Task = mongoose.model("Task", taskSchema)   