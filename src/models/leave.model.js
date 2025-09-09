import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fromDate: Date,
  toDate: Date,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // manager
},  { timestamps: true });

export const leave = mongoose.model("Leave", leaveSchema)   //model ka naam users, plural m save hota hai db m 