import { readFile } from "node:fs/promises";
import { Router } from "express";
import { parseEvents } from "../domain/events.js";
import { IMAGE_CATALOG } from "../domain/evidence-catalog.js";

const eventsFile = new URL("../data/events.json", import.meta.url);

export const eventsRouter = Router();

eventsRouter.get("/", async (_req, res, next) => {
  try {
    const data: unknown = JSON.parse(await readFile(eventsFile, "utf8"));
    res.json(parseEvents(data, IMAGE_CATALOG));
  } catch (error) {
    next(error);
  }
});
