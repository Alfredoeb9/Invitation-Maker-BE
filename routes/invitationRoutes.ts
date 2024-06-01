import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import {
  createInv,
  getAllInvitations,
  getSingleInvitation,
  deleteInvitation,
} from "../controller/invitationController.js";

const router = express.Router();

// require auth on all routes down below
router.use(requireAuth);
// GET ALL
router.get("/", getAllInvitations);

// GET Single invitation
router.get("/:id", getSingleInvitation);

// CREATE invitation
router.post("/create", createInv);

// DELETE a invitations
router.delete("/:id", deleteInvitation);

// UPDATE a invitation
// router.put("/:id", updateWorkout)

export default router;
