import express from "express";
import { equipmentRouter } from "./routes/equipment.js";

export const app = express();

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/equipment", equipmentRouter);
