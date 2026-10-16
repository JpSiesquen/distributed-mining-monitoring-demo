import { readFile } from "node:fs/promises";
import { Router } from "express";
import { parseEvents } from "../domain/events.js";

const eventsFile = new URL("../data/events.json", import.meta.url);
// No production image paths are approved until T11.
const imageCatalog = new Set<string>();

export const eventsRouter = Router();

eventsRouter.get("/", async (_req, res, next) => {
  try {
    const data: unknown = JSON.parse(await readFile(eventsFile, "utf8"));
    res.json(parseEvents(data, imageCatalog));
  } catch (error) {
    next(error);
  }
});
