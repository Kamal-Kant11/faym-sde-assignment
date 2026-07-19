import express from "express"

import payoutRoutes from "./routes/payout.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import saleRoutes from "./routes/sale.routes.js";

const app = express();

app.use(express.json())

app.use("/api/payouts", payoutRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/sales", saleRoutes);


export default app;