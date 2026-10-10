import { readFile } from "node:fs/promises";
import { Router } from "express";

const equipmentFile = new URL("../data/equipment.json", import.meta.url);

export const equipmentRouter = Router();

equipmentRouter.get("/", async (_req, res, next) => {
  try {
    const equipment = JSON.parse(await readFile(equipmentFile, "utf8"));
    res.json(equipment);
  } catch (error) {
    next(error);
  }
});
