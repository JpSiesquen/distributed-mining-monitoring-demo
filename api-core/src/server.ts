import { isIP } from "node:net";
import { app } from "./app.js";

function startServer(): void {
  const host = process.env.API_CORE_HOST;
  const portText = process.env.API_CORE_PORT;

  if (!host || isIP(host) === 0) {
    console.error("[startup_error] API_CORE_HOST must be a valid IP address.");
    process.exitCode = 1;
    return;
  }

  if (!portText || !/^\d+$/.test(portText)) {
    console.error("[startup_error] API_CORE_PORT must be an integer from 1 to 65535.");
    process.exitCode = 1;
    return;
  }

  const port = Number(portText);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("[startup_error] API_CORE_PORT must be an integer from 1 to 65535.");
    process.exitCode = 1;
    return;
  }

  try {
    const server = app.listen(port, host, () => {
      console.info(`[startup] API Core listening on ${host}:${port}.`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      const reasons: Record<string, string> = {
        EADDRINUSE: "Address or port already in use.",
        EADDRNOTAVAIL: "Listen address is unavailable.",
        EACCES: "Permission denied when opening the listen address."
      };
      console.error(`[startup_error] ${reasons[error.code ?? ""] ?? "Unable to start API Core."}`);
      process.exitCode = 1;
    });
  } catch {
    console.error("[startup_error] Unable to start API Core.");
    process.exitCode = 1;
  }
}

startServer();
