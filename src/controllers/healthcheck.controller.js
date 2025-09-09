import mongoose from "mongoose";
import os from "os";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthcheck = asyncHandler(async (req, res) => {
  // 1. Application Info
  const uptimeInSeconds = process.uptime();
  const appStatus = {
    name: "Task Management API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptimeInSeconds)}s`,
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
    loadAverage: os.loadavg(),
  };

  // 2. MongoDB Connection
  const dbStatus = {
    status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };

  // 3. Memory Usage
  const memory = process.memoryUsage();
  const memoryUsage = {
    rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memory.external / 1024 / 1024).toFixed(2)} MB`,
  };

  // 4. Node Info
  const nodeInfo = {
    version: process.version,
    execPath: process.execPath,
    pid: process.pid,
    cwd: process.cwd(),
  };

  // 5. Optional: Current Authenticated User
  const currentUser = req.user
    ? {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      }
    : null;

  // Construct full health object
  const healthReport = {
    app: appStatus,
    database: dbStatus,
    memory: memoryUsage,
    node: nodeInfo,
    user: currentUser,
  };

  return res.status(200).json(
    new ApiResponse(200, healthReport, "System health check passed")
  );
});

export { healthcheck };
