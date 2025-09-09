import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

export const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, subject, content } = req.body;
  const sender = req.user._id;

  if (!receiver || !subject || !content) {
    throw new ApiError(400, "receiver, subject, and content are required");
  }

  // Verify receiver exists
  const receiverUser = await User.findById(receiver);
  if (!receiverUser) {
    throw new ApiError(404, "Receiver user not found");
  }

  // Save the message
  const message = await Message.create({
    sender,
    receiver,
    subject,
    content,
  });

  return res.status(201).json(
    new ApiResponse(201, message, "Message sent successfully")
  );
});

export const getInbox = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const messages = await Message.find({ receiver: userId })
    .populate('sender', 'fullName email')
    .sort({ sentAt: -1 });

    // return res.status(200).json(messages);

  return res.status(200).json(
    new ApiResponse(200, messages, "Inbox messages fetched successfully")
  );
});
