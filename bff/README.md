# BFF

Servidor compilado de la [spec 004](../specs/004-bff-minimo/spec.md), con configuración externa
y logs de arranque. /health verifica la disponibilidad propia; /api/equipment consulta
únicamente API Core. Suite automatizada HTTP y ejecución de sus pruebas en CI pendientes.

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
| API_CORE_TIMEOUT_MS | 5000 | Entero de 1 a 2147483647; límite HTTP se aplicará al implementar la consulta. |

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

El job bff de [CI](../docs/ci.md#ampliación-bff--issue-61) comprueba política npm,
instalación y build; integrado en PR #83. La suite HTTP se incorporará en #65 y a CI en #66.
