import express from "express";
import { login, signUp, verifyEmail } from "../controller/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/login", login);
router.post("/sign-up", signUp);
router.post("/verify-email", requireAuth, verifyEmail);
// router.post("/sign-up", signUp);

export default router;
