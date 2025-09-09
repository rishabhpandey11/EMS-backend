import { Router } from 'express';
import {
    submitLeaveRequest,
    getAllLeaveRequests,
    updateLeaveStatus,
    getApprovedLeaveRequests,
    getRejectedLeaveRequests
} from '../controllers/leave.controller.js';

import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// 1️⃣ Employee submits leave request
router.post('/', verifyJWT, submitLeaveRequest);

// 2️⃣ Manager and Admin view all leave requests
router.get('/', verifyJWT, getAllLeaveRequests);

// 3️⃣ Manager updates leave status
router.put(
    '/:leaveId',
    verifyJWT,

    updateLeaveStatus
);

// In leave.routes.js or similar
router.get('/approved', verifyJWT, getApprovedLeaveRequests);

// In leave.routes.js or similar
router.get('/rejected', verifyJWT, getRejectedLeaveRequests);


export default router;
