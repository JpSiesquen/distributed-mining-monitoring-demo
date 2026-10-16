# BFF

Servidor compilado de la [spec 004](../specs/004-bff-minimo/spec.md), con configuración externa
y logs de arranque. /health verifica la disponibilidad propia; /api/equipment y /api/events
consultan únicamente API Core. La suite HTTP se ejecuta en CI; api-core/bff son obligatorios.

## Configuración y comandos

Node.js 24.21.0 y dependencias exactas revisadas en
[seguridad de dependencias](../docs/seguridad-dependencias.md#revisión-de-la-issue-59--bff).

Desde bff/, crear .env a partir del ejemplo solo si no existe:

```powershell
if (-not (Test-Path -LiteralPath '.env')) {
  Copy-Item -LiteralPath '..\.env.example' -Destination '.env'
}
npm run dev
```

| Variable | Ejemplo local | Validación |
|----------|---------------|------------|
| BFF_HOST | 127.0.0.1 | IP válida. |
| BFF_PORT | 3001 | Entero de 1 a 65535. |
| API_CORE_URL | http://127.0.0.1:3002 | Origen HTTP/HTTPS sin credenciales, path, query ni fragmento. |
| API_CORE_TIMEOUT_MS | 5000 | Entero de 1 a 2147483647; limita la respuesta completa, incluidas cabeceras y cuerpo. |

Todas son obligatorias. Reiniciar aplica cambios; QA usará las direcciones privadas acordadas.
Start carga .env de forma nativa; las variables del entorno prevalecen. No versionar .env ni secretos.

Build comprueba tipos y genera ES Modules JavaScript desde src/ hacia dist/.
Start ejecuta dist/server.js; dev ejecuta build y solo tras su éxito ejecuta start.

```powershell
npm run build
npm start
```

Un error de tipos termina con salida no cero; noEmitOnError impide emitir JavaScript nuevo.
La salida anterior puede seguir en dist/: un build fallido no la acredita como actual.
dist/ y node_modules/ están ignorados por Git.

## Estado verificado

- .npmrc declara ignore-scripts=true; instalación con scripts desactivados.
- Lockfile v3: 82 paquetes, versiones e integridades coincidentes con el grafo revisado.
- Build correcto emite dist/app.js y dist/server.js.
- Caso temporal TS2322: salida 1, sin emisión nueva y sin cambiar la salida previa;
  fuente temporal retirada y build correcto restaurado.
- Start y dev aceptan TCP; configuración inválida o puerto ocupado producen salida 1.
- Log de arranque: [startup] BFF listening on host:port. Fallos: [startup_error] con mensaje fijo,
  sin imprimir origen completo, valores sensibles o stack interno. No hay cambio automático de puerto.
- Dev con error de tipos no inicia el servidor de la compilación anterior.
- GET /health: 200 JSON {"status":"ok"}, sin X-Powered-By, incluso con API Core inaccesible;
  comprobado en dev y build/start. No verifica equipos, SQL ni disponibilidad de API Core.

Con el BFF iniciado, consultar GET http://127.0.0.1:3001/health en Postman o:

```powershell
curl.exe -i http://127.0.0.1:3001/health
```

## Consulta de equipos

Con API Core disponible, GET /api/equipment devuelve su mismo arreglo id/name por HTTP,
sin acceder al mock en disco ni a SQL. Se exige estado 200 y objetos con id/name de texto,
sin campos adicionales; no se siguen redirecciones hacia otros destinos.

```powershell
curl.exe -i http://127.0.0.1:3001/api/equipment
```

| Caso | Respuesta / diagnóstico |
|------|-------------------------|
| API Core responde correctamente | 200, arreglo id/name. |
| Fuente inaccesible, estado distinto de 200 o JSON/contrato inválido | 502 {"error":"Bad gateway"}. |
| Espera agotada, incluidas cabeceras y cuerpo | 504 {"error":"Gateway timeout"}. |
| Ruta desconocida | 404 {"error":"Not found"}. |

Logs [upstream_error]: network, upstream_status, invalid_json, invalid_contract o timeout.
No registran URL de la fuente, respuesta interna, credenciales ni stack. Health sigue disponible.
El timeout configurado cancela la consulta; no hay caché ni reintentos del BFF.

Verificado con API Core compilado real en dev/build-start; fuentes HTTP controladas verifican
errores y demoras. Cambiar puerto/origen y reiniciar modifica la consulta sin editar código.

## Pruebas

Después de compilar:

```powershell
npm test
```

La suite node:test sobre la app compilada y fuentes HTTP controladas conserva los casos de salud independiente,
contrato id/name, arreglo vacío, 404, fuente inaccesible, estados no-200, JSON inválido,
contratos inválidos, redirección rechazada y timeout de cabeceras/cuerpo. Verifican respuestas
y logs seguros, sin SQL ni credenciales. Puertos del sistema; servidores/conexiones cerrados
en finally incluso ante aserción fallida. La suite termina sin recursos pendientes.

El archivo se indica explícitamente para que su ausencia falle. Expectativa incorrecta
verificada en copia temporal: salida 1; suite de trabajo sin cambios y copia retirada.

El job bff de [CI](../docs/ci.md#ampliación-bff--issue-61) comprueba política npm,
instalación, build y la suite HTTP. Build integrado en PR #83; ejecución de pruebas y bloqueo
por aserción/fallos previos verificados e integrados en PR #89. Ver [evidencia](../docs/ci.md).

## Operación y diagnóstico

Iniciar API Core en otra terminal siguiendo su [guía](../api-core/README.md), después iniciar
el BFF con los comandos anteriores. Detener cada proceso con Ctrl+C. Para aplicar cambios
de configuración, detener y volver a iniciar; `start` requiere un build correcto previo.

| Señal | Comprobación |
|-------|--------------|
| `[startup_error]` | Revisar las cuatro variables y que host/puerto estén disponibles; el proceso termina con salida 1. |
| 502 / `network` | Comprobar que API Core esté iniciado y accesible desde el BFF en el origen configurado. |
| 502 / `upstream_status`, `invalid_json` o `invalid_contract` | Revisar estado y contrato de la ruta solicitada en API Core. |
| 504 / `timeout` | Revisar disponibilidad y tiempo de respuesta de API Core; el límite incluye la lectura del cuerpo. |
| `/health` devuelve 200, pero equipos falla | El BFF está disponible; revisar la comunicación y respuesta de API Core. |

## Evidencia de aceptación

Verificación del 2026-10-13 sobre la implementación integrada. La comprobación del flujo
usa API Core compilado real y datos simulados, en dev y build/start; no requiere SQL.

| Criterio | Evidencia |
|----------|-----------|
| CA1 | Health 200 JSON sin API Core; prueba automatizada de independencia y comprobación en ambos modos de arranque. |
| CA2 | Mismo arreglo id/name a través de API Core real por HTTP, en dev y build/start. BFF no importa archivos de datos ni driver SQL. |
| CA3 | Suite HTTP: fuente inaccesible, estado/JSON/contrato inválidos → 502; demora de cabeceras/cuerpo → 504; health disponible. |
| CA4 | Suite: 404 JSON y mensajes/logs por categoría sin respuesta interna, URL de origen ni stack. |
| CA5 | Cambio de origen/puerto tras reinicio verificado; diecisiete configuraciones inválidas y puerto ocupado terminan con salida 1. |
| CA6 | Flujo correcto en dev y build/start; TS2322 impide emitir y arrancar código anterior desde dev. |
| CA7 | Once pruebas correctas; expectativa incorrecta produce salida 1 y cierre de servidores/conexiones. |
| CA8 | [CI y casos negativos](../docs/ci.md#pruebas-bff-y-detención-de-pasos--issue-66), PR #89 integrado y checks api-core/bff obligatorios. |

La spec 004 acredita el tramo BFF → API Core. La tarea 001/T02 sigue pendiente hasta
verificar también el frontend en el flujo completo.

## Eventos de lectura — #95

GET /api/events consulta la misma ruta de API Core por HTTP, sin leer sus fixtures ni
acceder a SQL. Valida [eventos v1](../docs/contratos/eventos-v1.md) completo y conserva
el arreglo recibido. Rechaza claves adicionales, tipos/calendario UTC inválidos, folios
duplicados y orden incorrecto; no normaliza ni elimina registros. [] es una respuesta válida.
Solo acepta 200 con application/json, incluidos sus parámetros como charset.

Fuente inaccesible, redirección, estado no-200, JSON o contrato inválidos → 502 genérico.
Demora de cabeceras o cuerpo → 504 genérico; API_CORE_TIMEOUT_MS conserva el valor inicial
aprobado de 5000 ms. Sin caché ni reintentos. Logs únicamente por categoría, sin cuerpos,
URLs de origen, datos de atención ni stack. Health/equipment conservados.

Evidencia nula hasta T11; rutas no catalogadas rechazadas. El catálogo de metadatos usado
en pruebas no registra imágenes de producción ni incorpora material de faena.

### Validación reproducible

Tras revisar/preparar dependencias de ambos servicios, desde la raíz:

```powershell
npm run build --prefix api-core
npm run build --prefix bff
node --test bff/test/events.integration.test.mjs
```

La comprobación inicia las apps compiladas reales en puertos locales del sistema: BFF
consulta API Core por HTTP, conserva eventos/equipos y devuelve 502 tras su caída con
health disponible. No carga .env ni consulta archivos de datos desde BFF. Cierra servidores
y conexiones en finally. No es una prueba de frontend ni sustituye el arranque dev/start.

Resultado local #95: build, 46 pruebas BFF y una integración real correctos en copia
sin .env ni credenciales heredadas; instalación existente contrastada y sin paquetes nuevos.
La suite de 46 casos entra en el job bff por su npm test existente. La integración real
se ejecuta explícitamente tras compilar ambos servicios; no se añade al workflow en #95.
Estado y CI: [tareas 005](../specs/005-frontend-minimo/tasks.md). No acreditar consumo de la consola todavía.

[PR #101](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/101): [CI 38924815677](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38924815677) con api-core/bff correctos. Integración local sobre el código backend ae8007ce3f30863d96a264a9eb88a5f153edf734; proveedor integrado en b774cf38ae9888f46dfe166c369b869c28fe25b8, sin diferencias en su código. PR pendiente de integrar. No se acredita todavía la pareja frontend/backend.
