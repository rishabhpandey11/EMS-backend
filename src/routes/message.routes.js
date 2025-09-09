import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { sendMessage, getInbox } from '../controllers/message.controller.js';

const router = Router();

// POST /api/v1/messages/send  - send a message (authenticated)
router.post('/send', verifyJWT, sendMessage);

// GET /api/v1/messages/inbox  - get inbox messages for logged-in user
router.get('/inbox', verifyJWT, getInbox);

export default router;
