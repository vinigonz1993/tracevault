import { Router } from "express";
import { getChangeLogs, createAuditLog } from "../controllers/changelog.controller.js";
import { changeLogEvents } from "../routes/changelog.events.js";

const router = Router();

router.get("/change-logs", getChangeLogs);
router.post("/change-logs", createAuditLog);
router.get("/change-logs/events", changeLogEvents);


export default router;