# Contrato de lectura de eventos v1

Registro: 2026-10-15. Derivado del [plan 005 aprobado](../../specs/005-frontend-minimo/plan.md).
Estado: contrato aprobado; API Core #94 integrada en PR #100 (b774cf38); BFF #95 integrada en PR #101 (daf244ea); CI main 38929191630 correcta.
No modifica la aplicación frontend publicada ni acredita integración HTTP existente.

## Recorrido y respuesta

```text
Frontend → BFF GET /api/events → API Core GET /api/events → datos ficticios
```

200, Content-Type application/json, con arreglo directo de eventos. `[]` es una fuente
válida sin registros. El conjunto inicial se entrega completo, sin paginación, parámetros
de filtrado ni envoltorio/total. El frontend filtra y cuenta solo los registros recibidos.
Orden del proveedor: fechaHora descendente; empate por folio ascendente.

API Core es la autoridad de datos. BFF valida la respuesta completa, incluido su orden y Content-Type application/json, y conserva el arreglo sin reordenarlo.
El frontend valida el JSON antes de usarlo; TypeScript no valida datos en ejecución.
Una respuesta inválida se rechaza completa, sin omitir silenciosamente registros.
GET /api/equipment y /health conservan sus contratos y pruebas actuales.

## EventoCruce

Todos los campos son obligatorios salvo los indicados como opcionales. Solo se admiten
las claves enumeradas en cada objeto; null y ausencia tienen significados distintos.

| Campo | Tipo y validación |
|-------|-------------------|
| folio | Texto no vacío, formato EV-AAAAMMDD-NNNN; único dentro del arreglo. |
| estado | conforme, revision o no_conforme. |
| categoria | null para conforme/revision; categoría activa para no_conforme. |
| confianza | Número finito entre 0 y 1, ambos incluidos. |
| fechaHora | Fecha UTC válida, exactamente YYYY-MM-DDTHH:mm:ssZ. |
| puntoCaptura | Texto no vacío. |
| turno | A, B o C, suministrado por la fuente. |
| camara | Texto no vacío. |
| patente | Texto no vacío o null. |
| tipoTolva | eyectora o convencional. |
| empresa | Texto no vacío o null. |
| versionModelo | Texto no vacío. |
| observacion | Texto no vacío. |
| evidencia | null o el objeto Evidencia descrito debajo. |
| atencion | null o el objeto Atencion descrito debajo; solo lectura. |
| derivacion | Obligatorio para revision; ausente para conforme/no_conforme. |

Un texto obligatorio debe tener contenido, no solo espacios. No convertir tipos ni
completar datos ausentes con valores inventados. Categorías activas:
`sobrellenado_visual`, `mala_distribucion`, `tolva_levantada`; `cubre_lona` no está activa.
No inferir clasificación desde confianza ni incorporar umbrales/reglas físicas nuevos.
No se define equipmentId ni se presupone una relación con el listado id/name existente.

### Evidencia

| Campo | Regla |
|-------|-------|
| imagen | Ruta exacta del catálogo sintético acordado bajo /evidencia/demo/. |
| boundingBoxes | Arreglo de BoundingBox; puede estar vacío. |

BoundingBox contiene x, y, ancho y alto numéricos finitos: x/y >= 0, ancho/alto > 0,
x + ancho <= 1, y + alto <= 1. Coordenadas normalizadas respecto de la imagen completa.
etiqueta es texto opcional; cuando no exista, se omite. No admitir claves adicionales.

Las imágenes son ilustraciones de demostración servidas por el propio frontend. API Core
transporta rutas/recuadros; BFF no hace proxy de imágenes. No admitir URLs externas, query,
fragmentos, traversal ni rutas ajenas al catálogo. Un prefijo correcto por sí solo no valida
una ruta. T11 valida el recurso concreto con imagen, canvas y un PDF de compatibilidad.
`clip` queda fuera de v1. Una imagen ausente/fallida debe explicarse, sin simular evidencia.

Secuencia inicial: #94 se entregó con evidencia nula. Catálogo T11 aprobado el 2026-10-16,
preparado y verificado localmente; pendiente de publicación e integración coordinada:

| Recurso servido por el frontend | Evento ficticio | Dimensiones |
|--------------------------------|-----------------|-------------|
| `/evidencia/demo/camion-tolva-elevada.png` | `EV-20261015-0002` | 1672 × 941 px |

SHA-256: `38fa4516bc3d7f9142cc4629e60e14bc37650c0d70892603c5d89f88b952c568`.
Recuadro ilustrativo: x=0.32, y=0.03, ancho=0.22, alto=0.28, respecto de la imagen completa.
Los otros cinco eventos conservan evidencia nula. API Core, BFF y frontend deben registrar
la misma ruta exacta; ningún servicio backend almacena o sirve la imagen. Integrar los
validadores del proveedor antes del consumidor; este registro no acredita despliegue.

### Atencion y Derivacion

Atencion requiere estado (`pendiente`, `en_seguimiento`, `cerrado`), atendidoPor (texto no
vacío) y fechaHora UTC válida no anterior al evento. comentario es texto opcional, omitido
si no existe. Son datos ficticios de lectura, no una sesión ni una escritura confirmada.

Derivacion requiere motivo (`polvo_en_suspension`, `oclusion_parcial`, `baja_confianza`).
resolucion es opcional: `descartado`, `confirmado_conforme`, `confirmado_no_conforme`.
No admitir resolucion: null ni derivacion: null; se usan ausencia o los valores definidos.
Los opcionales se omiten en JSON, nunca se representan con undefined.

## Fechas y presentación

Usar instantes ficticios UTC explícitos y fechas de calendario válidas; rechazar horas
sin zona, offsets distintos de Z, fechas inexistentes y normalización silenciosa de fechas.
Mostrar UTC en consola y reporte. Orden, filtro por periodo y límites de medianoche deben
usar la misma convención, independientemente de la zona de la computadora.

No reinterpretar las fechas antiguas sin zona del demo como instantes reales. La zona
de una faena real se especificará al incorporar esa fuente. No calcular turnos reales
desde el reloj del cliente ni derivar un total operativo ajeno al conjunto recibido.

## Ejemplos ficticios válidos

Evento conforme, sin evidencia ni atención:

```json
[
  {
    "folio": "EV-20261015-0001",
    "estado": "conforme",
    "categoria": null,
    "confianza": 0.95,
    "fechaHora": "2026-10-15T12:00:00Z",
    "puntoCaptura": "Punto demo",
    "turno": "A",
    "camara": "Camara demo",
    "patente": null,
    "tipoTolva": "convencional",
    "empresa": null,
    "versionModelo": "demo-v1",
    "observacion": "Registro ficticio conforme.",
    "evidencia": null,
    "atencion": null
  }
]
```

Variante revision: sobre el evento anterior, cambiar estado a revision, conservar categoria
null y añadir `"derivacion": {"motivo": "baja_confianza"}`. La clasificación procede de
la fuente; no se deduce de un umbral implícito. Cambiar folio si coexiste con el ejemplo anterior.

Objeto Evidencia del catálogo T11 aprobado:

```json
{
  "imagen": "/evidencia/demo/camion-tolva-elevada.png",
  "boundingBoxes": [{"x": 0.32, "y": 0.03, "ancho": 0.22, "alto": 0.28, "etiqueta": "Área ilustrativa de tolva elevada"}]
}
```

El recurso es una ilustración sintética de demostración, sin material del cliente. Su
decodificación en navegador, exportación canvas e inclusión en un PDF real fueron verificadas
localmente. La descarga y las cifras del reporte completo se validan aparte en T12.

## Casos inválidos para validadores y pruebas

Aplicar cada cambio al ejemplo válido, por separado. Todos rechazan la respuesta completa.

| Cambio | Motivo de rechazo |
|--------|-------------------|
| Reemplazar arreglo por {"events": []} | Raíz distinta del arreglo directo acordado. |
| Quitar empresa o añadir equipmentId | Falta de campo obligatorio o clave desconocida. |
| confianza: "0.95", null o 1.1 | Tipo/rango inválido. |
| fechaHora: "2026-10-15T12:00:00" | Zona UTC ausente. |
| fechaHora: "2026-02-30T12:00:00Z" | Fecha de calendario inválida. |
| conforme con categoria: "sobrellenado_visual" | Combinación no admitida. |
| no_conforme con categoria: null o "cubre_lona" | Categoría obligatoria/activa incumplida. |
| revision sin derivacion, o conforme con derivacion | Combinación no admitida. |
| atencion anterior al evento | Orden temporal inválido. |
| Repetir folio dentro del arreglo | Identidad duplicada. |
| Evidencia con clip, URL externa o ruta sin catalogar | Clave o recurso fuera del contrato. |
| BoundingBox con ancho: 0 o x + ancho > 1 | Dimensiones/coordenadas inválidas. |

Comprobar también [] y múltiples eventos ordenados, desempate por folio, opcionales
omitidos, evento revision, no_conforme, evidencia y atención válidas. Los ejemplos no
sustituyen pruebas de red, carga/error, PDF ni verificación real de la pareja de versiones.

## Fallos, tiempos y compatibilidad

| Capa/caso | Resultado |
|-----------|-----------|
| API Core: lectura/contrato del fixture falla | 500 {"error":"Internal server error"}. |
| BFF: fuente inaccesible, no-200, JSON/contrato inválido o redirección | 502 {"error":"Bad gateway"}. |
| BFF: espera completa agotada, incluidas cabeceras/cuerpo | 504 {"error":"Gateway timeout"}. |

Errores y logs por categoría, sin cuerpos internos, credenciales ni stack. Health permanece
independiente. BFF usa API_CORE_TIMEOUT_MS existente (inicial 5000); frontend limita la
respuesta completa a diez segundos, permite reintento explícito y no hace retry/refetch
automático. No presentar el seed ni datos anteriores como respuesta vigente ante un fallo.

Primero implementar/verificar API Core y BFF; después conectar el consumidor. Referenciar
este documento mediante commit completo desde frontend y registrar ambos SHA al validar
integración. Cambiar campos, catálogo o validación exige revisión coordinada; no extender
v1 unilateralmente ni desplegar cambios incompatibles sobre el consumidor publicado.

Este documento no ejecuta migraciones ni cambia producción. Atención persistente, SQL,
ingesta real y despliegue quedan para entregas posteriores aprobadas.
