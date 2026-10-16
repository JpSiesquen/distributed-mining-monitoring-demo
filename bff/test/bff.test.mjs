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
    let bodyStarted = false;
    await withBff(t, (_req, res) => {
      if (phase === "body") {
        res.writeHead(200, { "content-type": "application/json" });
        res.write("[");
        bodyStarted = true;
      }
      const timer = setTimeout(() => {
        if (phase === "body") res.end(JSON.stringify(equipment[0]) + "]");
        else json(res, equipment);
      }, 1000);
      res.once("close", () => clearTimeout(timer));
    }, async ({ request, logs }) => {
      const pending = request("/api/equipment");
      await expectJson(await request("/health"), 200, { status: "ok" });
      await expectJson(await pending, 504, { error: "Gateway timeout" });
      if (phase === "body") assert.equal(bodyStarted, true, "Upstream body delay was exercised");
      assert.deepEqual(logs, ["[upstream_error] timeout."]);
    }, 50);
  });
}

function event(overrides = {}) {
  return {
    folio: "EV-20261015-0001", estado: "conforme", categoria: null,
    confianza: 0.95, fechaHora: "2026-10-15T12:00:00Z", puntoCaptura: "Punto demo",
    turno: "A", camara: "Camara demo", patente: null, tipoTolva: "convencional",
    empresa: null, versionModelo: "demo-v1", observacion: "Registro ficticio conforme.",
    evidencia: null, atencion: null, ...overrides,
  };
}

test("events preserve the complete valid array over the events HTTP route", async t => {
  const events = [event(),
    event({ folio: "EV-20261015-0002", estado: "revision", derivacion: { motivo: "baja_confianza" } }),
    event({ folio: "EV-20261015-0003", estado: "no_conforme", categoria: "mala_distribucion", atencion: {
      estado: "en_seguimiento", atendidoPor: "Operador demo", fechaHora: "2026-10-15T12:01:00Z", comentario: "Seguimiento ficticio.",
    } }),
  ];
  const calls = [];
  await withBff(t, (req, res) => { calls.push([req.method, req.url]); json(res, events); }, async ({ request, logs }) => {
    await expectJson(await request("/api/events"), 200, events);
    assert.deepEqual(calls, [["GET", "/api/events"]]);
    assert.deepEqual(logs, []);
  });
});

test("empty events source is a valid 200 array", async t => {
  await withBff(t, (_req, res) => json(res, []), async ({ request }) => {
    await expectJson(await request("/api/events"), 200, []);
  });
});

test("events source unavailable returns safe 502 and preserves independent health", async t => {
  let calls = 0;
  await withBff(t, (_req, res) => { calls++; json(res, []); }, async ({ request, source, logs }) => {
    await close(source);
    await expectJson(await request("/api/events"), 502, { error: "Bad gateway" });
    await expectJson(await request("/health"), 200, { status: "ok" });
    assert.equal(calls, 0);
    assert.deepEqual(logs, ["[upstream_error] network."]);
  });
});

test("non-200 events source does not expose its body", async t => {
  for (const status of [204, 500, 503]) {
    await withBff(t, (_req, res) => json(res, { detail: "private-fixture-detail" }, status), async ({ request, logs }) => {
      await expectJson(await request("/api/events"), 502, { error: "Bad gateway" });
      assert.deepEqual(logs, ["[upstream_error] upstream_status."]);
    });
  }
});

test("malformed events JSON produces safe invalid_json log", async t => {
  await withBff(t, (_req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end("{private-fixture-detail");
  }, async ({ request, logs }) => {
    await expectJson(await request("/api/events"), 502, { error: "Bad gateway" });
    assert.deepEqual(logs, ["[upstream_error] invalid_json."]);
  });
});

test("events reject a wrong media type even if its body is valid JSON", async t => {
  await withBff(t, (_req, res) => {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("[]");
  }, async ({ request, logs }) => {
    await expectJson(await request("/api/events"), 502, { error: "Bad gateway" });
    assert.deepEqual(logs, ["[upstream_error] invalid_contract."]);
  });
});

const invalidEvents = [
  ["wrapped response", () => ({ events: [] })],
  ["null root", () => null],
  ["null record", () => [null]],
  ["missing required field", () => { const item = event(); delete item.empresa; return [item]; }],
  ["unknown record field", () => [event({ privateField: "private-fixture-detail" })]],
  ["coerced confidence", () => [event({ confianza: "0.95" })]],
  ["out-of-range confidence", () => [event({ confianza: 1.1 })]],
  ["blank text", () => [event({ puntoCaptura: " " })]],
  ["invalid folio", () => [event({ folio: "EV-20261015-0001\n" })]],
  ["missing UTC zone", () => [event({ fechaHora: "2026-10-15T12:00:00" })]],
  ["impossible calendar day", () => [event({ fechaHora: "2026-02-30T12:00:00Z" })]],
  ["normalized clock", () => [event({ fechaHora: "2026-10-15T24:00:00Z" })]],
  ["invalid shift", () => [event({ turno: "D" })]],
  ["invalid truck type", () => [event({ tipoTolva: "demo" })]],
  ["invalid classification/category", () => [event({ categoria: "tolva_levantada" })]],
  ["inactive category", () => [event({ estado: "no_conforme", categoria: "cubre_lona" })]],
  ["revision without derivation", () => [event({ estado: "revision" })]],
  ["null optional resolution", () => [event({ estado: "revision", derivacion: { motivo: "baja_confianza", resolucion: null } })]],
  ["attention before event", () => [event({ atencion: { estado: "pendiente", atendidoPor: "Operador demo", fechaHora: "2026-10-15T11:59:59Z" } })]],
  ["null optional attention comment", () => [event({ atencion: { estado: "pendiente", atendidoPor: "Operador demo", fechaHora: "2026-10-15T12:00:00Z", comentario: null } })]],
  ["uncatalogued evidence", () => [event({ evidencia: { imagen: "/evidencia/demo/ilustracion-01.png", boundingBoxes: [] } })]],
  ["duplicate folios", () => [event(), event()]],
  ["wrong UTC order", () => [event({ fechaHora: "2026-10-15T11:00:00Z" }), event({ folio: "EV-20261015-0002" })]],
  ["wrong folio tie order", () => [event({ folio: "EV-20261015-0002" }), event()]],
  ["one invalid record among valid ones", () => [event(), event({ folio: "EV-20261015-0002", confianza: null })]],
];
for (const [name, value] of invalidEvents) {
  test(`events reject entire source: ${name}`, async t => {
    await withBff(t, (req, res) => json(res, req.url === "/api/equipment" ? equipment : value()), async ({ request, logs }) => {
      await expectJson(await request("/api/events"), 502, { error: "Bad gateway" });
      assert.deepEqual(logs, ["[upstream_error] invalid_contract."]);
      await expectJson(await request("/health"), 200, { status: "ok" });
      await expectJson(await request("/api/equipment"), 200, equipment);
    });
  });
}

test("events reject redirects without contacting the destination", async t => {
  let calls = 0;
  const destination = createServer((_req, res) => { calls++; json(res, [event()]); });
  try {
    const destinationUrl = await listen(destination);
    await withBff(t, (_req, res) => {
      res.writeHead(302, { location: destinationUrl + "/api/events" }); res.end();
    }, async ({ request, logs }) => {
      await expectJson(await request("/api/events"), 502, { error: "Bad gateway" });
      assert.deepEqual(logs, ["[upstream_error] network."]);
      assert.equal(calls, 0);
    });
  } finally { await close(destination); }
});

for (const phase of ["headers", "body"]) {
  test(`events timeout includes delayed ${phase} and preserves health`, async t => {
    let bodyStarted = false;
    await withBff(t, (_req, res) => {
      if (phase === "body") {
        res.writeHead(200, { "content-type": "application/json" });
        res.write("["); bodyStarted = true;
      }
      const timer = setTimeout(() => {
        if (phase === "body") res.end(JSON.stringify(event()) + "]");
        else json(res, [event()]);
      }, 1000);
      res.once("close", () => clearTimeout(timer));
    }, async ({ request, logs }) => {
      const pending = request("/api/events");
      await expectJson(await request("/health"), 200, { status: "ok" });
      await expectJson(await pending, 504, { error: "Gateway timeout" });
      if (phase === "body") assert.equal(bodyStarted, true);
      assert.deepEqual(logs, ["[upstream_error] timeout."]);
    }, 100);
  });
}

test("events validator accepts evidence metadata only through an isolated test catalog", async () => {
  const { parseEvents } = await import("../dist/domain/events.js");
  const image = "/evidencia/demo/ilustracion-01.png";
  const catalog = new Set([image]);
  const item = event({ evidencia: { imagen: image, boundingBoxes: [{ x: 0.2, y: 0.1, ancho: 0.8, alto: 0.9 }] } });
  assert.deepEqual(parseEvents([item], catalog), [item]);
  item.evidencia.boundingBoxes[0].ancho = 0.9;
  assert.throws(() => parseEvents([item], catalog), TypeError);
});

test('catalogued synthetic evidence passes through HTTP unchanged', async t => {
  const { readFile } = await import('node:fs/promises');
  const events = JSON.parse(await readFile(new URL('../../api-core/src/data/events.json', import.meta.url), 'utf8'))
    .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora) || a.folio.localeCompare(b.folio));
  await withBff(t, (_req, res) => json(res, events), async ({ request }) => {
    const response = await request('/api/events');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), events);
    assert.equal(events.filter(event => event.evidencia !== null).length, 1);
    assert.equal(events.find(event => event.evidencia)?.evidencia.imagen, '/evidencia/demo/camion-tolva-elevada.png');
  });
});
