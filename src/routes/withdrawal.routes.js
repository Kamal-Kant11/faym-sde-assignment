import express from "express";
import { createWithdrawal, failWithdrawal } from "../controllers/withdrawal.controller.js";

const router = express.Router();

router.post("/", createWithdrawal);

router.put("/:id/fail", failWithdrawal);

export default router;