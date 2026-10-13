# Tareas 004 — BFF mínimo para consulta de equipos

- **Spec:** [004](spec.md)
- **Plan:** [004](plan.md), aprobado el 2026-10-13
- **Estado:** Aprobadas el 2026-10-13; pendientes de ejecución

Prerrequisito: API Core y CI de las specs 002/003 implementados y verificados.
El orden introduce CI tras la compilación y pruebas al existir las rutas. Las casillas
se marcan con evidencia; esta lista no autoriza instalaciones ni ejecución de Actions.

## Issues de ejecución

[Milestone Fase 3](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/milestone/4).
T01–T09 corresponden, en orden, a las issues
[#59](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/59),
[#60](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/60),
[#61](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/61),
[#62](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/62),
[#63](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/63),
[#64](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/64),
[#65](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/65),
[#66](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/66) y
[#67](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/67).

## Tareas

- [x] **T01 — Revisar y autorizar dependencias.** Evaluar las versiones candidatas del plan,
  origen, avisos, scripts directos/transitivos y comandos exactos. Registrar selección y
  aprobación en seguridad de dependencias antes de instalar.
  **Comprobar:** selección justificada sin paquetes adicionales de comodidad; instalación
  con ignore-scripts y sin credenciales sensibles. Prerrequisito de T02; R8.
  **Evidencia:** revisión del 2026-10-13 en seguridad de dependencias; 82 versiones del grafo
  existente contrastadas con registro y avisos actuales. Selección y comandos aprobados
  explícitamente para #60; sin instalación en #59. Grafo definitivo BFF pendiente de T02.

- [ ] **T02 — Preparar proyecto compilable.** Crear bff/package.json, .npmrc, lockfile v3,
  tsconfig estricto ES Modules y módulo mínimo. Instalar solo lo autorizado en T01 y
  contrastar el lockfile con la selección revisada.
  **Comprobar:** ignore-scripts efectivo; build genera JavaScript en dist/. Un error de tipos
  termina con salida no cero y no emite código nuevo. R6; prepara CA6.

- [ ] **T03 — Incorporar CI de compilación del BFF.** Revalidar Actions, comandos y permisos;
  añadir job bff al workflow existente con los controles del plan. Conservar api-core.
  Validar el job antes de exigir su check en el ruleset, dentro de esta entrega.
  **Comprobar:** ambos jobs pasan; un error de tipos del BFF falla su job con api-core correcto
  y bloquea integración al exigir ambos checks. Control de .npmrc previo a npm ci,
  permisos mínimos y límite de cinco minutos. Depende de T02; R8/CA8 parcial.

- [ ] **T04 — Configurar arranque, logs y comandos.** Crear app.ts/server.ts; validar las
  cuatro variables del plan antes de escuchar y actualizar .env.example. Implementar
  start sobre dist/server.js y dev como build seguido de start solo tras éxito.
  **Comprobar:** dev y build/start arrancan; cambiar puerto/destino y reiniciar aplica
  configuración. Valores inválidos o puerto ocupado terminan con salida no cero y logs
  seguros. Un error de tipos impide que dev arranque una compilación anterior.
  Depende de T02; R5/R6/R7; CA5 y parte de CA6.

- [ ] **T05 — Añadir salud independiente.** GET /health devuelve 200 JSON status ok;
  desactivar X-Powered-By. No consultar API Core desde esta ruta.
  **Comprobar:** respuesta correcta con API Core detenido en dev y build/start.
  Depende de T04; R2/CA1.

- [ ] **T06 — Consultar equipos y gestionar fallos.** Usar fetch nativo hacia API Core;
  validar respuesta 200 y arreglo id/name. Limitar headers y cuerpo con la espera configurada.
  Incorporar 404/502/504 JSON genéricos y logs por categoría; capturar fallos asíncronos.
  **Comprobar:** API Core real entrega el mismo arreglo a través del BFF; fuente inaccesible,
  respuesta no exitosa, JSON/contrato inválido producen 502; demora de headers o cuerpo,
  504. Health permanece disponible y no hay lectura del mock, SQL ni datos sensibles
  en respuestas/logs. Depende de T05; R1/R3/R4/R7; CA2/CA3/CA4.

- [ ] **T07 — Automatizar contratos y fallos.** Añadir node:test sobre la app compilada,
  con servidor HTTP controlado y puertos asignados por el sistema. Cubrir los casos de
  T05/T06, ausencia de X-Powered-By y limpieza aun ante una aserción fallida.
  **Comprobar:** npm test pasa tras build; expectativa incorrecta causa salida no cero;
  servidores y conexiones se cierran. Sin SQL, frontend ni credenciales de despliegue.
  Depende de T06; R8/CA7 y evidencia automatizada de CA1–CA4.

- [ ] **T08 — Incorporar y validar pruebas en CI.** Añadir npm test al job bff y contrastar
  el ruleset con los dos checks. Usar cambios temporales para verificar fallos sin integrarlos.
  **Comprobar:** instalación/build/pruebas correctos dan ambos checks verdes; prueba BFF
  incorrecta bloquea integración con api-core verde. Falta de protección npm falla antes
  de instalar; fallo de instalación impide build/test. Restaurar y enlazar ejecuciones.
  Depende de T03/T07; R8/CA8.

- [ ] **T09 — Documentar operación y verificar cierre.** Redactar bff/README.md y actualizar
  docs/ci.md, roadmap y estados pertinentes con comandos, configuración, rutas, diagnóstico
  y evidencia por CA. Verificar API Core → BFF en dev y build/start.
  **Comprobar:** CA1–CA8 acreditados antes de marcar spec implementada; documentación coincide
  con código, lockfile y CI. No completar 001/T02: el frontend sigue pendiente.
  Depende de T04–T08; todos los requisitos y criterios de aceptación.
