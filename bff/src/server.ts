import { isIP } from "node:net";
import { createApp } from "./app.js";

function startServer(): void {
  const host = process.env.BFF_HOST;
  const portText = process.env.BFF_PORT;
  const apiCoreUrlText = process.env.API_CORE_URL;
  const timeoutText = process.env.API_CORE_TIMEOUT_MS;

  if (!host || isIP(host) === 0) {
    failStartup("BFF_HOST must be a valid IP address.");
    return;
  }

  const port = positiveInteger(portText, 65535);
  if (port === undefined) {
    failStartup("BFF_PORT must be an integer from 1 to 65535.");
    return;
  }

  let apiCoreUrl: URL;
  try {
    if (!apiCoreUrlText) {
      throw new Error("Missing origin");
    }
    apiCoreUrl = new URL(apiCoreUrlText);
    if (
      !["http:", "https:"].includes(apiCoreUrl.protocol) ||
      apiCoreUrl.username || apiCoreUrl.password ||
      apiCoreUrl.search || apiCoreUrl.hash || apiCoreUrl.pathname !== "/"
    ) {
      throw new Error("Invalid origin");
    }
  } catch {
    failStartup("API_CORE_URL must be an HTTP(S) origin without credentials, path, query or fragment.");
    return;
  }

  const timeout = positiveInteger(timeoutText, 2147483647);
  if (timeout === undefined) {
    failStartup("API_CORE_TIMEOUT_MS must be an integer from 1 to 2147483647.");
    return;
  }

  const app = createApp({ apiCoreUrl: apiCoreUrl.origin, apiCoreTimeoutMs: timeout });
  const server = app.listen(port, host, () => {
    console.info(`[startup] BFF listening on ${host}:${port}.`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    const reasons: Record<string, string> = {
      EADDRINUSE: "Address or port already in use.",
      EADDRNOTAVAIL: "Listen address is unavailable.",
      EACCES: "Permission denied when opening the listen address."
    };
    failStartup(reasons[error.code ?? ""] ?? "Unable to start BFF.");
  });
}

function positiveInteger(value: string | undefined, maximum: number): number | undefined {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= maximum ? number : undefined;
}

function failStartup(message: string): void {
  console.error(`[startup_error] ${message}`);
  process.exitCode = 1;
}

startServer();
