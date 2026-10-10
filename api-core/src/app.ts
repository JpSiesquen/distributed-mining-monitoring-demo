import express, { type NextFunction, type Request, type Response } from "express";
import { equipmentRouter } from "./routes/equipment.js";

export const app = express();

app.disable("x-powered-by");

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/equipment", equipmentRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Express identifies error handlers by their four parameters; keep `_next` even though it is unused.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[request_error] Request failed: ${errorKind(error)}.`);
  res.status(500).json({ error: "Internal server error" });
});

function errorKind(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as NodeJS.ErrnoException).code;
    return code ?? error.name;
  }
  return "UnknownError";
}
