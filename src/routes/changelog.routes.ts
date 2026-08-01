import { Router } from "express";
import { getChangeLogs, createAuditLog } from "../controllers/changelog.controller.js";

const router = Router();

router.get("/change-logs", getChangeLogs);
router.post("/change-logs", createAuditLog);

export default router;