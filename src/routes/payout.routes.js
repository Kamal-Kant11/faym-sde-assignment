import express from "express";
import { reconcileSale, runAdvancePayout } from "../controllers/payout.controller.js";

const router = express.Router();

router.post("/advance", runAdvancePayout);

router.put("/reconcile/:saleId", reconcileSale);

export default router;