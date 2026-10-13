import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../dist/app.js";

const equipment = [{ id: "eq-1", name: "Equipo uno" }, { id: "eq-2", name: "Equipo dos" }];

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

async function close(server) {
  if (!server.listening) return;
  const closed = new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
  server.closeAllConnections();
  await closed;
}

async function withBff(t, sourceHandler, verify, timeout = 5000) {
  const source = createServer(sourceHandler);
  let server;
  const logs = [];
  t.mock.method(console, "error", (...messages) => logs.push(messages.join(" ")));
  try {
    const sourceUrl = await listen(source);
    server = createServer(createApp({ apiCoreUrl: sourceUrl, apiCoreTimeoutMs: timeout }));
    const baseUrl = await listen(server);
    const request = route => fetch(baseUrl + route, { signal: AbortSignal.timeout(5000) });
    await verify({ request, source, logs });
  } finally {
    if (server) await close(server);
    await close(source);
  }
}

function json(res, value, status = 200) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(value));
}

async function expectJson(response, status, expected) {
  assert.equal(response.status, status);
  assert.match(response.headers.get("content-type"), /^application\/json/);
  assert.equal(response.headers.get("x-powered-by"), null);
  assert.deepEqual(await response.json(), expected);
}

test("health is independent of the upstream", async t => {
  let sourceCalls = 0;
  await withBff(t, (_req, res) => { sourceCalls++; json(res, equipment); }, async ({ request, source }) => {
    await close(source);
    await expectJson(await request("/health"), 200, { status: "ok" });
    assert.equal(sourceCalls, 0);
  });
});

test("equipment preserves id/name over HTTP", async t => {
  const calls = [];
  await withBff(t, (req, res) => { calls.push([req.method, req.url]); json(res, equipment); }, async ({ request }) => {
    await expectJson(await request("/api/equipment"), 200, equipment);
    assert.deepEqual(calls, [["GET", "/api/equipment"]]);
  });
});

test("empty equipment array is valid", async t => {
  await withBff(t, (_req, res) => json(res, []), async ({ request }) => {
    await expectJson(await request("/api/equipment"), 200, []);
  });
});

test("unknown route returns safe JSON without calling upstream", async t => {
  let sourceCalls = 0;
  await withBff(t, (_req, res) => { sourceCalls++; json(res, equipment); }, async ({ request }) => {
    await expectJson(await request("/missing"), 404, { error: "Not found" });
    assert.equal(sourceCalls, 0);
  });
});

test("inaccessible source returns 502 while health remains available", async t => {
  await withBff(t, (_req, res) => json(res, equipment), async ({ request, source, logs }) => {
    await close(source);
    await expectJson(await request("/api/equipment"), 502, { error: "Bad gateway" });
    assert.deepEqual(logs, ["[upstream_error] network."]);
    await expectJson(await request("/health"), 200, { status: "ok" });
  });
});

test("non-200 source statuses return 502 without exposing body", async t => {
  for (const status of [204, 500, 503]) {
    await withBff(t, (_req, res) => json(res, { detail: "private-fixture-detail" }, status), async ({ request, logs }) => {
      await expectJson(await request("/api/equipment"), 502, { error: "Bad gateway" });
      assert.deepEqual(logs, ["[upstream_error] upstream_status."]);
    });
  }
});

test("malformed JSON returns 502 with safe log", async t => {
  await withBff(t, (_req, res) => { res.end("{private-fixture-detail"); }, async ({ request, logs }) => {
    await expectJson(await request("/api/equipment"), 502, { error: "Bad gateway" });
    assert.deepEqual(logs, ["[upstream_error] invalid_json."]);
  });
});

test("invalid equipment contracts return 502 without leaking fields", async t => {
  for (const value of [null, {}, [null], [{ id: 1, name: "Fixture" }], [{ id: "eq", name: 1 }],
    [{ id: "eq" }], [{ id: "eq", name: "Fixture", secret: "private-fixture-detail" }]]) {
    await withBff(t, (_req, res) => json(res, value), async ({ request, logs }) => {
      await expectJson(await request("/api/equipment"), 502, { error: "Bad gateway" });
      assert.deepEqual(logs, ["[upstream_error] invalid_contract."]);
    });
  }
});

test("redirect does not contact another source", async t => {
  let redirectedCalls = 0;
  const destination = createServer((_req, res) => { redirectedCalls++; json(res, equipment); });
  try {
    const destinationUrl = await listen(destination);
    await withBff(t, (_req, res) => {
      res.writeHead(302, { location: destinationUrl + "/api/equipment" });
      res.end();
    }, async ({ request, logs }) => {
      await expectJson(await request("/api/equipment"), 502, { error: "Bad gateway" });
      assert.deepEqual(logs, ["[upstream_error] network."]);
      assert.equal(redirectedCalls, 0);
    });
  } finally { await close(destination); }
});

for (const phase of ["headers", "body"]) {
  test(`timeout covers delayed ${phase} and preserves health`, async t => {
    await withBff(t, (_req, res) => {
      if (phase === "body") { res.writeHead(200, { "content-type": "application/json" }); res.write("["); }
      const timer = setTimeout(() => {
        if (phase === "body") res.end(JSON.stringify(equipment[0]) + "]");
        else json(res, equipment);
      }, 1000);
      res.once("close", () => clearTimeout(timer));
    }, async ({ request, logs }) => {
      const pending = request("/api/equipment");
      await expectJson(await request("/health"), 200, { status: "ok" });
      await expectJson(await pending, 504, { error: "Gateway timeout" });
      assert.deepEqual(logs, ["[upstream_error] timeout."]);
    }, 50);
  });
}
