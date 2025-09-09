import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller.js"
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', verifyJWT, authorizeRoles("admin"), healthcheck);

export default router