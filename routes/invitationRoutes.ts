import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import { createInv } from "../controller/invitationController.js";

const router = express.Router();

router.post("/create", createInv);

export default router;
