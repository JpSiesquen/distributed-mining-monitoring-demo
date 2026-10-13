# BFF

Servidor compilado de la [spec 004](../specs/004-bff-minimo/spec.md), con configuración externa
y logs de arranque. /health verifica la disponibilidad propia; /api/equipment y pruebas
automatizadas HTTP pendientes. Todavía no consulta API Core.

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

El job bff de [CI](../docs/ci.md#ampliación-bff--issue-61) comprueba política npm,
instalación y build; integrado en PR #83. Todavía no hay pruebas HTTP BFF.
