import { Router } from "express";
import { getChangeLogs, createAuditLog, getObjectTypes } from "../controllers/changelog.controller.js";
import { changeLogEvents } from "../routes/changelog.events.js";

const router = Router();

router.get("/change-logs", getChangeLogs);
router.post("/change-logs", createAuditLog);
router.get("/change-logs/events", changeLogEvents);
router.get("/change-logs/object-types", getObjectTypes);

export default router;