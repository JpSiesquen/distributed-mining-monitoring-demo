import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { app as apiCore } from "../../api-core/dist/app.js";
import { createApp } from "../dist/app.js";

// Run after building both services. The BFF obtains all data via HTTP; this harness
// starts the real compiled provider without importing its fixtures into the BFF.
async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

async function close(server) {
  if (!server?.listening) return;
  const closed = new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
  server.closeAllConnections();
  await closed;
}

async function readJson(url, expectedStatus) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, expectedStatus);
  assert.match(response.headers.get("content-type"), /^application\/json/);
  assert.equal(response.headers.get("x-powered-by"), null);
  return response.json();
}

test("BFF reads events/equipment from compiled API Core over HTTP and survives its outage", async t => {
  const calls = [];
  const logs = [];
  t.mock.method(console, "error", (...parts) => logs.push(parts.join(" ")));
  const coreServer = createServer((req, res) => {
    calls.push([req.method, req.url]);
    apiCore(req, res);
  });
  let bffServer;
  try {
    const coreUrl = await listen(coreServer);
    const expectedEvents = await readJson(coreUrl + "/api/events", 200);
    const expectedEquipment = await readJson(coreUrl + "/api/equipment", 200);
    assert.ok(expectedEvents.length > 0);
    assert.equal(expectedEvents.filter(item => item.evidencia !== null).length, 1);
    assert.equal(expectedEvents.find(item => item.evidencia)?.evidencia.imagen, "/evidencia/demo/camion-tolva-elevada.png");
    calls.length = 0;

    bffServer = createServer(createApp({ apiCoreUrl: coreUrl, apiCoreTimeoutMs: 5000 }));
    const bffUrl = await listen(bffServer);
    assert.deepEqual(await readJson(bffUrl + "/health", 200), { status: "ok" });
    assert.deepEqual(calls, []);
    assert.deepEqual(await readJson(bffUrl + "/api/events", 200), expectedEvents);
    assert.deepEqual(await readJson(bffUrl + "/api/equipment", 200), expectedEquipment);
    assert.deepEqual(calls, [["GET", "/api/events"], ["GET", "/api/equipment"]]);
    assert.deepEqual(logs, []);

    await close(coreServer);
    assert.deepEqual(await readJson(bffUrl + "/api/events", 502), { error: "Bad gateway" });
    assert.deepEqual(await readJson(bffUrl + "/health", 200), { status: "ok" });
    assert.deepEqual(logs, ["[upstream_error] network."]);
  } finally {
    await close(bffServer);
    await close(coreServer);
  }
});
