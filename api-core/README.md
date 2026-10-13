# API Core

Servicio HTTP con Node.js 24.21.0, Express 4.22.3 y TypeScript 5.9.3.
El alcance actual sirve equipos ficticios desde un JSON; no se conecta a SQL Server.
Contratos y aceptación: [spec 002](../specs/002-api-core-minimo/spec.md).

## Preparación local

Desde la raíz del repositorio, en PowerShell/Warp:

```powershell
Set-Location api-core
if (-not (Test-Path -LiteralPath .env)) { Copy-Item -LiteralPath ..\.env.example -Destination .env }
```

Node.js debe coincidir con la versión de `package.json` y CI. Antes de instalar o actualizar,
aplicar la [política de dependencias](../AGENTS.md#política-de-dependencias-y-ejecución).
Tras la autorización, la instalación reproducible usa `npm ci --ignore-scripts`.
Mantener `.npmrc` con `ignore-scripts=true` y el lockfile versionado.

## Configuración

`npm start` carga `api-core/.env` mediante la capacidad nativa de Node.js.
Las variables de la sesión tienen prioridad sobre las del archivo. `.env` no se versiona.

| Variable | Valor local | Uso |
|----------|-------------|-----|
| API_CORE_HOST | 127.0.0.1 | Dirección IP de escucha; loopback limita el acceso a la propia máquina. |
| API_CORE_PORT | 3002 | Puerto entero entre 1 y 65535. |

Ambas variables son obligatorias. El servicio no elige otro puerto automáticamente.
Tras cambiar configuración, detener el proceso y arrancarlo de nuevo.
`DATABASE_URL` está reservada para una integración posterior y no se utiliza en este alcance.

## Comandos

```powershell
npm run dev
```

Compila y, solo si build termina correctamente, arranca el servidor. No hay recarga automática:
tras editar código, detener con Ctrl+C y volver a ejecutar dev.

Para ejecutar la salida compilada:

```powershell
npm run build
npm start
```

Build comprueba tipos, genera JavaScript en `dist/` y copia el mock a `dist/data/`.
`noEmitOnError` impide nuevas salidas ante errores de tipos; no borra una compilación anterior.
`start` ejecuta `dist/server.js` sin recompilar. No editar `dist/`; editar `src/` y compilar.

Para comprobar los contratos, con el servidor manual detenido:

```powershell
npm run build
npm test
```

Las seis pruebas usan servidores temporales con puertos asignados por el sistema y datos ficticios.
Comprueban salud, equipos, 404, ausencia de X-Powered-By, 500 por mock ausente y salud disponible
sin mock. Cierran servidores y eliminan sus copias temporales.

## Rutas y comprobación manual

Con el servidor activo, crear peticiones GET en Postman a las URL siguientes.
Confirmar después desde otra terminal:

```powershell
curl.exe -i http://127.0.0.1:3002/health
curl.exe -i http://127.0.0.1:3002/api/equipment
curl.exe -i http://127.0.0.1:3002/does-not-exist
```

| Ruta | Resultado |
|------|-----------|
| /health | 200 JSON: `{"status":"ok"}`. Solo confirma que API Core responde; no verifica SQL Server ni la disponibilidad de los datos. |
| /api/equipment | 200 JSON: arreglo del mock con id/name de texto. |
| Ruta desconocida | 404 JSON: `{"error":"Not found"}`. |
| Fallo al leer/interpretar el mock | 500 JSON: `{"error":"Internal server error"}`; detalle seguro en el log. |

Para verificar 500, usar `npm test`: su copia temporal omite el mock sin alterar los datos de trabajo.

## Logs y diagnóstico

Los eventos se escriben en la consola del proceso. No hay almacenamiento persistente de logs
configurado en esta entrega; la retención de los servidores se concretará al desplegar.

| Evento | Diagnóstico |
|--------|-------------|
| `[startup]` | Escucha iniciada; muestra host/puerto configurados. |
| `[startup_error]` por configuración | Revisar presencia/formato de host y puerto; no se imprime el valor inválido. |
| `[startup_error]` por dirección ocupada | Detener la instancia que corresponda o acordar otro puerto y reiniciar; no matar procesos desconocidos. |
| `[request_error] ... ENOENT` | Mock ausente en la salida compilada; volver a ejecutar build y comprobar `dist/data/equipment.json`. |
| `[request_error] ... SyntaxError` | Revisar sintaxis del JSON fuente y recompilar; no devolver su contenido al cliente. |

Un 404 indica que la ruta solicitada no existe; no demuestra una caída del servidor.
Un `/health` exitoso no descarta un fallo en `/api/equipment`.
No registrar credenciales, el entorno completo, rutas internas ni contenido del mock.

## Evidencia de cierre

Verificada el 2026-10-12 en una copia temporal con entorno mínimo y `.env` ficticio, sin SQL
ni credenciales de despliegue. Build/start y dev se probaron con los scripts reales;
los procesos y archivos temporales se limpiaron. [CI y fallos controlados](../docs/ci.md).

| Criterio | Resultado verificado |
|----------|----------------------|
| CA1 | /health devuelve 200 JSON con status ok. |
| CA2 | /api/equipment devuelve 200 y el contenido id/name del mock. |
| CA3 | Ambas rutas funcionan sin configuración o conexión SQL. |
| CA4 | Cambio de puerto mediante entorno y reinicio, sin editar código; escucha loopback. |
| CA5 | Ruta inexistente: 404 JSON. Copia sin mock: 500 genérico; /health sigue disponible. |
| CA6 | Contratos correctos en build/start y dev; mock presente en dist/data. |
| CA7 | Eventos distintos para inicio, puerto ocupado, configuración inválida y ENOENT; sin datos sensibles. |
| CA8 | Seis pruebas correctas. [Expectativa incorrecta](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38330299235) falla con salida 1 y [restauración](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38330429291) vuelve a verde. |

Este cierre corresponde únicamente a API Core. El flujo Frontend → BFF → API Core de
001/T02 sigue pendiente hasta disponer de las otras capas.
