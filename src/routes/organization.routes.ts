import { Router } from "express";
import {
    listOrganizations,
    createOrganization,
    listOrganizationUsers,
} from "../controllers/organization.controller.js";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.get("/", listOrganizations);
router.post("/", createOrganization);
router.get("/organizations/:organizationId/users", listOrganizationUsers);

export default router;