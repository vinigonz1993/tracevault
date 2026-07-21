import { Router } from "express";
import {
    listOrganizations,
    createOrganization,
    listOrganizationUsers,
} from "../controllers/organization.controller.js";

const router = Router();

router.get("/", listOrganizations);
router.post("/", createOrganization);
router.get("/organizations/:organizationId/users", listOrganizationUsers);

export default router;