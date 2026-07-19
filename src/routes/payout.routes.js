import express from "express";
import { runAdvancePayout } from "../controllers/payout.controller.js";

const router = express.Router();

router.post("/advance", runAdvancePayout);

export default router;