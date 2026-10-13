import express from "express";

export type BffConfig = {
  apiCoreUrl: string;
  apiCoreTimeoutMs: number;
};

export function createApp(_config: BffConfig) {
  const app = express();
  app.disable("x-powered-by");
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  return app;
}
