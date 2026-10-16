export interface BoundingBox {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  etiqueta?: string;
}

export interface EventoCruce {
  folio: string;
  estado: "conforme" | "revision" | "no_conforme";
  categoria: "sobrellenado_visual" | "mala_distribucion" | "tolva_levantada" | null;
  confianza: number;
  fechaHora: string;
  puntoCaptura: string;
  turno: "A" | "B" | "C";
  camara: string;
  patente: string | null;
  tipoTolva: "eyectora" | "convencional";
  empresa: string | null;
  versionModelo: string;
  observacion: string;
  evidencia: { imagen: string; boundingBoxes: BoundingBox[] } | null;
  atencion: {
    estado: "pendiente" | "en_seguimiento" | "cerrado";
    atendidoPor: string;
    fechaHora: string;
    comentario?: string;
  } | null;
  derivacion?: {
    motivo: "polvo_en_suspension" | "oclusion_parcial" | "baja_confianza";
    resolucion?: "descartado" | "confirmado_conforme" | "confirmado_no_conforme";
  };
}

type RecordValue = Record<string, unknown>;
const eventKeys = [
  "folio", "estado", "categoria", "confianza", "fechaHora", "puntoCaptura",
  "turno", "camara", "patente", "tipoTolva", "empresa", "versionModelo",
  "observacion", "evidencia", "atencion",
];

function isRecord(value: unknown): value is RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasKeys(value: RecordValue, required: string[], optional: string[] = []): boolean {
  return required.every((key) => Object.hasOwn(value, key)) &&
    Object.keys(value).every((key) => required.includes(key) || optional.includes(key));
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function oneOf(value: unknown, choices: string[]): boolean {
  return typeof value === "string" && choices.includes(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isUtcInstant(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value.replace("Z", ".000Z");
}

function validBox(value: unknown): boolean {
  if (!isRecord(value) || !hasKeys(value, ["x", "y", "ancho", "alto"], ["etiqueta"])) return false;
  const { x, y, ancho, alto } = value;
  return isFiniteNumber(x) && isFiniteNumber(y) && isFiniteNumber(ancho) && isFiniteNumber(alto) &&
    x >= 0 && y >= 0 && ancho > 0 && alto > 0 && x + ancho <= 1 && y + alto <= 1 &&
    (!Object.hasOwn(value, "etiqueta") || typeof value.etiqueta === "string");
}

function validEvidence(value: unknown, imageCatalog: ReadonlySet<string>): boolean {
  if (value === null) return true;
  if (!isRecord(value) || !hasKeys(value, ["imagen", "boundingBoxes"]) || !isText(value.imagen)) return false;
  const prefix = "/evidencia/demo/";
  const segments = value.imagen.slice(prefix.length).split("/");
  return value.imagen.startsWith(prefix) && !/[\\?#]/.test(value.imagen) &&
    segments.every((segment) => segment !== "" && segment !== "." && segment !== "..") &&
    imageCatalog.has(value.imagen) && Array.isArray(value.boundingBoxes) && value.boundingBoxes.every(validBox);
}

function validAttention(value: unknown, eventTime: string): boolean {
  if (value === null) return true;
  return isRecord(value) && hasKeys(value, ["estado", "atendidoPor", "fechaHora"], ["comentario"]) &&
    oneOf(value.estado, ["pendiente", "en_seguimiento", "cerrado"]) && isText(value.atendidoPor) &&
    isUtcInstant(value.fechaHora) && value.fechaHora >= eventTime &&
    (!Object.hasOwn(value, "comentario") || typeof value.comentario === "string");
}

function validDerivation(value: unknown): boolean {
  return isRecord(value) && hasKeys(value, ["motivo"], ["resolucion"]) &&
    oneOf(value.motivo, ["polvo_en_suspension", "oclusion_parcial", "baja_confianza"]) &&
    (!Object.hasOwn(value, "resolucion") || oneOf(value.resolucion, ["descartado", "confirmado_conforme", "confirmado_no_conforme"]));
}

function validEvent(value: unknown, imageCatalog: ReadonlySet<string>): boolean {
  if (!isRecord(value) || !hasKeys(value, eventKeys, ["derivacion"])) return false;
  if (!isText(value.folio) || value.folio.length !== 16 || !/^EV-\d{8}-\d{4}$/.test(value.folio) || !isUtcInstant(value.fechaHora)) return false;
  if (!["puntoCaptura", "camara", "versionModelo", "observacion"].every((key) => isText(value[key]))) return false;
  if (!["patente", "empresa"].every((key) => value[key] === null || isText(value[key]))) return false;
  if (!isFiniteNumber(value.confianza) || value.confianza < 0 || value.confianza > 1) return false;
  if (!oneOf(value.turno, ["A", "B", "C"]) || !oneOf(value.tipoTolva, ["eyectora", "convencional"])) return false;
  if (value.estado === "no_conforme") {
    if (!oneOf(value.categoria, ["sobrellenado_visual", "mala_distribucion", "tolva_levantada"])) return false;
  } else if ((value.estado !== "conforme" && value.estado !== "revision") || value.categoria !== null) {
    return false;
  }
  if (value.estado === "revision") {
    if (!validDerivation(value.derivacion)) return false;
  } else if (Object.hasOwn(value, "derivacion")) {
    return false;
  }
  return validEvidence(value.evidencia, imageCatalog) && validAttention(value.atencion, value.fechaHora);
}

export function parseEvents(value: unknown, imageCatalog: ReadonlySet<string>): EventoCruce[] {
  if (!Array.isArray(value) || !value.every((event) => validEvent(event, imageCatalog))) {
    throw new TypeError("Invalid events fixture");
  }
  const events = value as EventoCruce[];
  if (new Set(events.map((event) => event.folio)).size !== events.length) {
    throw new TypeError("Invalid events fixture");
  }
  return [...events].sort((left, right) => {
    if (left.fechaHora !== right.fechaHora) return left.fechaHora > right.fechaHora ? -1 : 1;
    return left.folio < right.folio ? -1 : left.folio > right.folio ? 1 : 0;
  });
}
