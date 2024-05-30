import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import {
  createInv,
  getAllInvitations,
} from "../controller/invitationController.js";

const router = express.Router();

// require auth on all routes down below
router.use(requireAuth);
// GET ALL
router.get("/", getAllInvitations);

// CREATE invitation
router.post("/create", createInv);

// DELETE a invitations
// router.post("/:id", deleteWorkout);

// UPDATE a invitation
// router.put("/:id", updateWorkout)

export default router;
