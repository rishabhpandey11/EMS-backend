import { Router } from "express";
import {
    createTask,
    getTasksForEmployee,
    updateTaskStatus,
    getTasksAssignedByManager,
    getVerifiedEmployeesforTasks,
    getAllTasksForManager
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/v1/tasks -> manager creates task
// GET /api/v1/tasks -> employee fetches tasks
// Manager routes
router.post("/createtask", verifyJWT, createTask);
router.get("/assigned-tasks", verifyJWT, getTasksAssignedByManager);   // Manager fetches tasks they assigned
router.get('/alltasks', verifyJWT , getAllTasksForManager);

// Employee routes
router.get('/fetchtask', verifyJWT, getTasksForEmployee);

// PUT /api/v1/tasks/:taskId/status -> employee updates task status
router
    .route('/:taskId/status')
    .put(verifyJWT, updateTaskStatus);

router.get('/employees/verified', verifyJWT, getVerifiedEmployeesforTasks);
export default router;
