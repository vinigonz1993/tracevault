import { Router } from "express";
import { listOrganizations, createOrganization } from "../controllers/organization.controller.js";

const router = Router();

router.get("/", listOrganizations);
router.post("/", createOrganization);

export default router;