import assert from "node:assert/strict";
import { once } from "node:events";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { after, before, beforeEach, describe, test } from "node:test";
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

const { parseEvents } = await import(pathToFileURL(join(distDir, "domain", "events.js")));
const noImages = new Set();

function demoEvent(overrides = {}) {
  return {
    folio: "EV-20261015-0001", estado: "conforme", categoria: null,
    confianza: 0.95, fechaHora: "2026-10-15T12:00:00Z", puntoCaptura: "Punto demo",
    turno: "A", camara: "Camara demo", patente: null, tipoTolva: "convencional",
    empresa: null, versionModelo: "demo-v1", observacion: "Registro ficticio conforme.",
    evidencia: null, atencion: null, ...overrides,
  };
}

describe("events v1 contract", () => {
  test("accepts empty data and does not mutate source order", () => {
    assert.deepEqual(parseEvents([], noImages), []);
    const input = [
      demoEvent({ folio: "EV-20261015-0003", fechaHora: "2026-10-15T11:00:00Z" }),
      demoEvent({ folio: "EV-20261015-0002" }),
      demoEvent(),
    ];
    const snapshot = structuredClone(input);
    assert.deepEqual(parseEvents(input, noImages).map((item) => item.folio), [
      "EV-20261015-0001", "EV-20261015-0002", "EV-20261015-0003",
    ]);
    assert.deepEqual(input, snapshot);
  });

  test("accepts declared classifications and optional attention/derivation fields", () => {
    const input = [
      demoEvent({ confianza: 0 }),
      demoEvent({ folio: "EV-20261015-0002", confianza: 1, estado: "revision", derivacion: { motivo: "baja_confianza" } }),
      demoEvent({ folio: "EV-20261015-0003", estado: "no_conforme", categoria: "tolva_levantada", atencion: {
        estado: "pendiente", atendidoPor: "Operador demo", fechaHora: "2026-10-15T12:00:00Z",
      } }),
      demoEvent({ folio: "EV-20261015-0004", estado: "revision", derivacion: {
        motivo: "oclusion_parcial", resolucion: "confirmado_conforme",
      }, atencion: { estado: "cerrado", atendidoPor: "Operador demo", fechaHora: "2026-10-15T13:00:00Z", comentario: "Revisión ficticia." } }),
    ];
    assert.deepEqual(parseEvents(input, noImages), input);
  });

  test("accepts a real leap day in UTC", () => {
    const item = demoEvent({ fechaHora: "2028-02-29T23:59:59Z" });
    assert.deepEqual(parseEvents([item], noImages), [item]);
  });

  const invalidChanges = [
    ["missing required field", (item) => { delete item.empresa; }],
    ["unknown field", (item) => { item.equipmentId = "demo"; }],
    ["blank required text", (item) => { item.camara = "  "; }],
    ["invalid folio format", (item) => { item.folio = "demo"; }],
    ["folio with trailing newline", (item) => { item.folio += "\n"; }],
    ["coerced confidence", (item) => { item.confianza = "0.95"; }],
    ["confidence below zero", (item) => { item.confianza = -0.1; }],
    ["confidence above one", (item) => { item.confianza = 1.1; }],
    ["non-finite confidence", (item) => { item.confianza = NaN; }],
    ["missing UTC marker", (item) => { item.fechaHora = "2026-10-15T12:00:00"; }],
    ["UTC offset instead of Z", (item) => { item.fechaHora = "2026-10-15T12:00:00+00:00"; }],
    ["fractional seconds", (item) => { item.fechaHora = "2026-10-15T12:00:00.000Z"; }],
    ["impossible calendar day", (item) => { item.fechaHora = "2026-02-30T12:00:00Z"; }],
    ["non-leap February 29", (item) => { item.fechaHora = "2026-02-29T12:00:00Z"; }],
    ["normalized 24-hour clock", (item) => { item.fechaHora = "2026-10-15T24:00:00Z"; }],
    ["unknown shift", (item) => { item.turno = "D"; }],
    ["unknown truck type", (item) => { item.tipoTolva = "demo"; }],
    ["non-null category on conforme", (item) => { item.categoria = "sobrellenado_visual"; }],
    ["missing category on no_conforme", (item) => { item.estado = "no_conforme"; }],
    ["inactive category", (item) => { item.estado = "no_conforme"; item.categoria = "cubre_lona"; }],
    ["revision without derivation", (item) => { item.estado = "revision"; }],
    ["derivation on conforme", (item) => { item.derivacion = { motivo: "baja_confianza" }; }],
    ["null derivation", (item) => { item.estado = "revision"; item.derivacion = null; }],
    ["null optional resolution", (item) => { item.estado = "revision"; item.derivacion = { motivo: "baja_confianza", resolucion: null }; }],
    ["unknown derivation field", (item) => { item.estado = "revision"; item.derivacion = { motivo: "baja_confianza", extra: true }; }],
    ["attention before event", (item) => { item.atencion = { estado: "pendiente", atendidoPor: "Operador demo", fechaHora: "2026-10-15T11:59:59Z" }; }],
    ["invalid attention time", (item) => { item.atencion = { estado: "pendiente", atendidoPor: "Operador demo", fechaHora: "2026-02-30T12:00:00Z" }; }],
    ["unknown attention state", (item) => { item.atencion = { estado: "demo", atendidoPor: "Operador demo", fechaHora: item.fechaHora }; }],
    ["null optional comment", (item) => { item.atencion = { estado: "pendiente", atendidoPor: "Operador demo", fechaHora: item.fechaHora, comentario: null }; }],
    ["blank nullable company", (item) => { item.empresa = " "; }],
    ["uncatalogued image", (item) => { item.evidencia = { imagen: "/evidencia/demo/ilustracion-01.png", boundingBoxes: [] }; }],
  ];
  for (const [name, change] of invalidChanges) {
    test(`rejects entire response: ${name}`, () => {
      const invalid = demoEvent({ folio: "EV-20261015-0002" });
      change(invalid);
      assert.throws(() => parseEvents([demoEvent(), invalid], noImages), TypeError);
    });
  }

  test("rejects a wrapped/non-array response and duplicate folios", () => {
    for (const value of [{ events: [] }, null, "[]", [demoEvent(), demoEvent()]]) {
      assert.throws(() => parseEvents(value, noImages), TypeError);
    }
  });
});

describe("events evidence with a test-only catalog", () => {
  const image = "/evidencia/demo/ilustracion-01.png";
  const catalog = new Set([image]);
  const evidence = () => ({ imagen: image, boundingBoxes: [
    { x: 0.2, y: 0, ancho: 0.8, alto: 1, etiqueta: "Demostración" },
  ] });

  test("accepts catalogued metadata and optional labels without assuming a real asset", () => {
    const item = demoEvent({ evidencia: evidence() });
    assert.deepEqual(parseEvents([item], catalog), [item]);
    item.evidencia.boundingBoxes = [{ x: 0, y: 0, ancho: 1, alto: 1 }];
    assert.deepEqual(parseEvents([item], catalog), [item]);
    item.evidencia.boundingBoxes = [];
    assert.deepEqual(parseEvents([item], catalog), [item]);
  });

  const invalidEvidence = [
    ["unregistered sibling", (value) => { value.imagen = "/evidencia/demo/unregistered.png"; }],
    ["external URL", (value) => { value.imagen = "https://example.invalid/image.png"; }],
    ["query string", (value) => { value.imagen += "?v=1"; }],
    ["fragment", (value) => { value.imagen += "#image"; }],
    ["traversal", (value) => { value.imagen = "/evidencia/demo/../image.png"; }],
    ["clip outside v1", (value) => { value.clip = "demo"; }],
    ["negative coordinate", (value) => { value.boundingBoxes[0].x = -0.1; }],
    ["zero width", (value) => { value.boundingBoxes[0].ancho = 0; }],
    ["box past right edge", (value) => { value.boundingBoxes[0].ancho = 0.9; }],
    ["box past bottom edge", (value) => { value.boundingBoxes[0].y = 0.1; }],
    ["non-finite dimension", (value) => { value.boundingBoxes[0].alto = Infinity; }],
    ["unknown box field", (value) => { value.boundingBoxes[0].score = 0.9; }],
    ["null optional label", (value) => { value.boundingBoxes[0].etiqueta = null; }],
  ];
  for (const [name, change] of invalidEvidence) {
    test(`rejects evidence: ${name}`, () => {
      const value = evidence();
      change(value);
      assert.throws(() => parseEvents([demoEvent({ evidencia: value })], catalog), TypeError);
    });
  }
});

describe("GET /api/events compiled fixture", () => {
  let server;
  let baseUrl;

  before(async () => {
    const { app } = await import(pathToFileURL(join(distDir, "app.js")));
    ({ server, baseUrl } = await startServer(app));
  });

  after(async () => { if (server) await stopServer(server); });

  test("returns the entire synthetic dataset in contract order", async () => {
    const response = await fetch(`${baseUrl}/api/events`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.equal(response.headers.get("x-powered-by"), null);
    assert.deepEqual(body.map((item) => item.folio), [
      "EV-20261016-0001", "EV-20261015-0004", "EV-20261015-0005",
      "EV-20261015-0003", "EV-20261015-0002", "EV-20261015-0001",
    ]);
    const fixture = JSON.parse(readFileSync(join(distDir, "data", "events.json"), "utf8"));
    assert.equal(body.length, fixture.length);
    for (const item of body) {
      assert.deepEqual(item, fixture.find((candidate) => candidate.folio === item.folio));
      assert.equal(item.evidencia === null, item.folio !== "EV-20261015-0002");
    }
  });

  test("build copies the complete events JSON without altering the source", () => {
    const source = readFileSync(new URL("../src/data/events.json", import.meta.url), "utf8");
    assert.equal(readFileSync(join(distDir, "data", "events.json"), "utf8"), source);
  });
});

describe("GET /api/events fixture failures and empty source", () => {
  let tempDir;
  let file;
  let server;
  let baseUrl;
  const initial = JSON.stringify([demoEvent()]);

  before(async () => {
    tempDir = mkdtempSync(join(distDir, tempPrefix));
    assert.equal(dirname(tempDir), resolve(distDir));
    assert.ok(basename(tempDir).startsWith(tempPrefix));
    for (const entry of readdirSync(distDir)) {
      if (!entry.startsWith(tempPrefix)) cpSync(join(distDir, entry), join(tempDir, entry), { recursive: true });
    }
    file = join(tempDir, "data", "events.json");
    const { app } = await import(pathToFileURL(join(tempDir, "app.js")));
    ({ server, baseUrl } = await startServer(app));
  });

  beforeEach(() => { writeFileSync(file, initial); });

  after(async () => {
    if (server) await stopServer(server);
    if (tempDir) {
      assert.equal(dirname(tempDir), resolve(distDir));
      assert.ok(basename(tempDir).startsWith(tempPrefix));
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("empty array is a valid 200 source", async () => {
    writeFileSync(file, "[]");
    const response = await fetch(`${baseUrl}/api/events`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
  });

  test("sorts UTC instants and resolves ties by ascending folio", async () => {
    writeFileSync(file, JSON.stringify([
      demoEvent({ folio: "EV-20261015-0003", fechaHora: "2026-10-15T11:59:59Z" }),
      demoEvent({ folio: "EV-20261015-0002" }), demoEvent(),
    ]));
    const response = await fetch(`${baseUrl}/api/events`);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).map((item) => item.folio), [
      "EV-20261015-0001", "EV-20261015-0002", "EV-20261015-0003",
    ]);
  });

  const badSources = [
    ["missing file", () => { rmSync(file); }],
    ["malformed JSON", () => { writeFileSync(file, '{"fixture-content-must-not-leak":'); }],
    ["wrapped root", () => { writeFileSync(file, '{"events":[]}'); }],
    ["duplicate folios", () => { writeFileSync(file, JSON.stringify([demoEvent(), demoEvent()])); }],
    ["invalid record among valid records", () => { writeFileSync(file, JSON.stringify([
      demoEvent(), demoEvent({ folio: "EV-20261015-0002", confianza: "0.95" }),
    ])); }],
    ["uncatalogued production evidence", () => { writeFileSync(file, JSON.stringify([
      demoEvent({ evidencia: { imagen: "/evidencia/demo/ilustracion-01.png", boundingBoxes: [] } }),
    ])); }],
  ];
  for (const [name, damage] of badSources) {
    test(`safe 500 for ${name}; health and equipment remain available`, async () => {
      damage();
      const messages = [];
      const originalError = console.error;
      let response;
      try {
        console.error = (...parts) => messages.push(parts.join(" "));
        response = await fetch(`${baseUrl}/api/events`);
        assert.equal(response.status, 500);
        assert.match(response.headers.get("content-type"), /application\/json/);
        assert.equal(response.headers.get("x-powered-by"), null);
        assert.deepEqual(await response.json(), { error: "Internal server error" });
      } finally { console.error = originalError; }
      assert.equal(messages.length, 1);
      assert.match(messages[0], /^\[request_error\] Request failed: (ENOENT|SyntaxError|TypeError)\.$/);
      assert.doesNotMatch(messages[0], /fixture-content-must-not-leak|events\.json|node_modules|at /);
      const health = await fetch(`${baseUrl}/health`);
      assert.equal(health.status, 200);
      assert.deepEqual(await health.json(), { status: "ok" });
      const equipment = await fetch(`${baseUrl}/api/equipment`);
      assert.equal(equipment.status, 200);
      assert.ok(Array.isArray(await equipment.json()));
    });
  }
});
