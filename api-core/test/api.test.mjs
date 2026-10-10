import assert from "node:assert/strict";
import { once } from "node:events";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const tempPrefix = ".tmp-test-";

async function startServer(app) {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

function stopServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

describe("API Core with mock data", () => {
  let server;
  let baseUrl;

  before(async () => {
    const { app } = await import(pathToFileURL(join(distDir, "app.js")));
    ({ server, baseUrl } = await startServer(app));
  });

  after(async () => {
    await stopServer(server);
  });

  test("GET /health returns status ok", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.deepEqual(await response.json(), { status: "ok" });
  });

  test("GET /api/equipment returns the mock equipment", async () => {
    const expected = JSON.parse(readFileSync(join(distDir, "data", "equipment.json"), "utf8"));

    const response = await fetch(`${baseUrl}/api/equipment`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0);
    for (const item of body) {
      assert.equal(typeof item.id, "string");
      assert.equal(typeof item.name, "string");
    }
    assert.deepEqual(body, expected);
  });

  test("unknown route returns 404 JSON", async () => {
    const response = await fetch(`${baseUrl}/does-not-exist`);

    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "Not found" });
  });

  test("responses do not expose X-Powered-By", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.headers.get("x-powered-by"), null);
  });
});

// The copy lives inside dist/ so that compiled modules still resolve node_modules.
describe("API Core without mock data", () => {
  let tempDir;
  let server;
  let baseUrl;

  before(async () => {
    tempDir = mkdtempSync(join(distDir, tempPrefix));
    for (const entry of readdirSync(distDir)) {
      if (entry !== "data" && !entry.startsWith(tempPrefix)) {
        cpSync(join(distDir, entry), join(tempDir, entry), { recursive: true });
      }
    }
    const { app } = await import(pathToFileURL(join(tempDir, "app.js")));
    ({ server, baseUrl } = await startServer(app));
  });

  after(async () => {
    if (server) {
      await stopServer(server);
    }
    rmSync(tempDir, { recursive: true, force: true });
  });

  test("GET /api/equipment returns a generic 500 JSON", async () => {
    const response = await fetch(`${baseUrl}/api/equipment`);

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Internal server error" });
  });

  test("GET /health stays available", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
  });
});
