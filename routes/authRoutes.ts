import express, { Express } from "express";
import { signUp } from "../controller/authController.js";
const router = express.Router();

router.post("/sign-up", signUp);
// router.post("/sign-up", signUp);

export default router;
