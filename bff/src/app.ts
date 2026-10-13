import express from "express";

export type BffConfig = {
  apiCoreUrl: string;
  apiCoreTimeoutMs: number;
};

export function createApp(config: BffConfig) {
  const app = express();
  app.disable("x-powered-by");
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/api/equipment", async (_req, res) => {
    const signal = AbortSignal.timeout(config.apiCoreTimeoutMs);
    let failure = "network";
    try {
      const response = await fetch(`${config.apiCoreUrl}/api/equipment`, {
        signal,
        redirect: "error"
      });
      if (response.status !== 200) {
        void response.body?.cancel().catch(() => {});
        failure = "upstream_status";
        throw new Error("Invalid upstream status");
      }
      failure = "invalid_json";
      const equipment: unknown = await response.json();
      failure = "invalid_contract";
      if (!Array.isArray(equipment) || !equipment.every(item =>
        item !== null && typeof item === "object" &&
        Object.keys(item).length === 2 &&
        typeof item.id === "string" && typeof item.name === "string"
      )) {
        throw new Error("Invalid upstream contract");
      }
      res.status(200).json(equipment);
    } catch {
      const timedOut = signal.aborted;
      console.error(`[upstream_error] ${timedOut ? "timeout" : failure}.`);
      res.status(timedOut ? 504 : 502).json({
        error: timedOut ? "Gateway timeout" : "Bad gateway"
      });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
  return app;
}
