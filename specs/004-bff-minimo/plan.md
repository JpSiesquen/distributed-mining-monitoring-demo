# Plan 004 — BFF mínimo para consulta de equipos

- **Spec:** [004](spec.md), aprobada el 2026-10-13
- **Estado:** Aprobado e implementado el 2026-10-13; verificación en [T01–T09](tasks.md).

## Enfoque

Crear el BFF con Node.js, Express 4 y TypeScript, conservando el contrato id/name.
Consultar API Core mediante fetch nativo; sin acceso SQL, mocks propios de operación,
capas adicionales, caché ni reintentos. La consulta tendrá espera limitada y errores seguros.

## Diseño

### Archivos propuestos en bff/

| Archivo | Responsabilidad |
|---------|-----------------|
| package.json y package-lock.json | Versiones exactas y comandos build/start/dev/test. |
| .npmrc | ignore-scripts=true. |
| tsconfig.json | ES Modules, tipos estrictos, src → dist y noEmitOnError. |
| src/server.ts | Validar entorno, crear la app e iniciar la escucha con logs seguros. |
| src/app.ts | Crear Express, health, consulta de equipos y errores JSON. |
| test/bff.test.mjs | Probar la aplicación compilada con HTTP controlado y herramientas nativas. |
| README.md | Operación, comandos, rutas y diagnóstico. |

Actualizar el .env.example de la raíz cuando se implemente. La configuración local estará
en bff/.env, ignorado. No crear un repositorio de datos ni un cliente HTTP genérico.

### Configuración aprobada

| Variable | Propuesta local | Validación |
|----------|-----------------|------------|
| BFF_HOST | 127.0.0.1 | Dirección IP válida. |
| BFF_PORT | 3001 | Entero entre 1 y 65535; puerto ya acordado en 001. |
| API_CORE_URL | http://127.0.0.1:3002 | Origen HTTP/HTTPS válido, sin credenciales, query ni fragmento. |
| API_CORE_TIMEOUT_MS | 5000 | Entero de 1 a 2147483647; valor inicial aprobado, no un SLA. |

Host, puerto y URL se revisan antes de abrir la escucha. QA usará la IP privada del servicio
correspondiente; no inventar sus direcciones. Ante configuración inválida o puerto ocupado,
terminar con salida no cero y mensaje fijo; no imprimir valores sensibles ni elegir otro puerto.
Los nombres y valores de esta tabla están aprobados para la operación local.
El máximo del timeout evita que Node reduzca una demora fuera de rango a 1 ms;
[límite de temporizadores](https://github.com/nodejs/node/blob/main/doc/api/timers.md).

### Rutas y comunicación

- GET /health: 200 JSON con status ok; no llama a API Core.
- GET /api/equipment: una petición GET a /api/equipment del origen configurado.
  Aceptar respuesta 200 JSON con arreglo de objetos id/name de texto y devolverlo sin
  añadir envoltorios ni campos. Rechazar JSON o contrato inválido con 502 genérico.
  No seguir redirecciones: preservar R1 y evitar consultas a destinos ajenos al origen validado.
- API Core inaccesible o con respuesta no exitosa: 502 JSON genérico.
- Espera agotada: 504 JSON genérico. AbortSignal.timeout limita la consulta, incluida
  la lectura del cuerpo; no iniciar reintentos ni dejar una petición HTTP pendiente.
- Ruta desconocida: 404 JSON. Logs de consulta identifican la categoría del fallo sin
  incluir URL completa, cuerpo de respuesta, credenciales o stack interno.

Crear la app mediante una función que recibe la configuración validada. Esto permite
usar distintas fuentes HTTP en las pruebas sin abrir la escucha al importar el módulo.
Capturar explícitamente fallos asíncronos de Express 4; desactivar X-Powered-By.

### Comandos y pruebas

Build ejecuta tsc. Start ejecuta dist/server.js con la carga nativa opcional de .env.
Dev ejecuta build y solo tras su éxito inicia start; sin recarga automática.
Test usa node:test, assert y fetch sobre la aplicación compilada; no añadir un framework.

Usar un servidor HTTP temporal como API Core controlado: respuesta válida, estado de error,
JSON inválido, contrato inválido y respuesta demorada. Comprobar también fuente inaccesible,
health independiente y ruta desconocida. Los puertos de prueba se asignan por el sistema;
cerrar servidores, conexiones y temporales incluso ante fallo. Verificar además la consulta
al API Core real con datos ficticios en dev y build/start antes del cierre.

### CI — separación y checks aprobados

Ampliar el workflow existente con un job independiente bff. Mantener api-core intacto y
añadir bff como check obligatorio del ruleset en el mismo cambio, tras su validación.
Alternativa: añadir pasos BFF al job api-core; evita un segundo check, pero mezcla diagnósticos
y ejecución de ambos componentes. Se aprueba separar jobs al existir dos componentes reales;
ambos checks serán obligatorios. La aprobación no habilita todavía cambios en el workflow o ruleset.

El nuevo job reutilizará runner, Node.js, SHA y permisos mínimos del plan 003, con límite
de cinco minutos y caché desactivada. En bff/: controlar .npmrc/configuración efectiva,
npm ci --ignore-scripts, build y test. Sin SQL, servidores del cliente ni secretos de despliegue.
Revalidar Actions, permisos, condiciones y autorización de comandos antes de habilitarlo.
Actualizar documentación de CI y comprobar un fallo BFF bloqueado con API Core correcto.

## Decisiones

- Aceptadas en la spec: arreglo id/name, health propio y errores de fuente 502/504.
- Aprobada el 2026-10-13: jobs api-core y bff separados, ambos checks obligatorios.
- Aprobada el 2026-10-13: espera inicial de cinco segundos, configurable mediante API_CORE_TIMEOUT_MS;
  cubre la respuesta completa, cancela la consulta al agotarse y devuelve 504.
- Aprobada el 2026-10-13: configuración local de la tabla y plan completo.
- Dependencias aprobadas el 2026-10-13 por coherencia con API Core: Express 4.22.3, TypeScript 5.9.3,
  @types/express 4.17.25 y @types/node 24.19.1. Revisión preliminar del 2026-10-13 registrada
  en [seguridad de dependencias](../../docs/seguridad-dependencias.md#revisión-de-la-issue-59--bff);
  selección/comandos aprobados para #60. Contrastar el lockfile BFF definitivo en T02.
- La separación de capas sigue [arquitectura](../../docs/architecture.md). La ampliación de CI
  se registra en [ADR 0010](../../docs/adr/0010-ci-por-componente.md); jobs y checks BFF/API Core implementados.

## Respuesta a preguntas abiertas

- P1/P2: resueltas; preservar contrato y errores aprobados.
- P3: resuelta; separación de CI, ambos checks obligatorios y espera configurable de cinco segundos aprobados.

## Trazabilidad

| Requisito | Solución y comprobación |
|-----------|-------------------------|
| R1 | HTTP a un origen fijo; sin driver SQL ni lectura del mock. CA2. |
| R2 | Health local independiente del cliente HTTP. CA1. |
| R3 | Consulta y validación del arreglo id/name sin adaptación. CA2. |
| R4 | AbortSignal, 404/502/504 genéricos y pruebas de fuente controlada. CA3/CA4. |
| R5 | Entorno validado y reinicio para destino/puerto distinto. CA5. |
| R6 | Comandos compilados y dev condicionado al build. CA6. |
| R7 | Categorías de logs sin información sensible; revisar salidas de fallos. CA4. |
| R8 | Pruebas nativas y checks api-core/bff obligatorios, separación aprobada. CA7/CA8. |

## Riesgos

- Cadena de suministro: aplicar [revisión y autorización](../../docs/seguridad-dependencias.md)
  antes de instalar; no repetir la investigación histórica de Shai-Hulud.
- Espera incompleta: el límite debe cubrir también cuerpos demorados, no solo cabeceras.
- Integración prematura: habilitar el check bff cuando exista un job validado; conservar api-core.
- Complejidad anticipada: revisar adaptación de datos al especificar frontend (004/P1);
  no añadir campos, caché o reintentos sin requisito concreto.
