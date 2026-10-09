# Tareas 002 — API Core mínimo con equipos simulados

- **Spec:** [002](spec.md)
- **Plan:** [002](plan.md)
- **Estado:** En ejecución; T01–T03 integradas (PR #32–#34); T04 completada. Siguiente: T05, mediante 003/T01-T02 (issues #4 y #7)

Spec, plan y tareas aprobados el 2026-10-03. Los IDs se ordenan antes de crear issues.
La CI se rige por la [spec 003](../003-ci-minima/spec.md) y su plan, ambos aprobados.
Instalaciones y ejecución de Actions requieren su autorización; esta lista no las ejecuta.

- [x] **T01 — Validar dependencias exactas.** Selección aprobada: Express 4.22.3, TypeScript 5.9.3,
  @types/express 4.17.25 y @types/node 24.19.1. Revisión, finalidad y comandos registrados en
  [seguridad de dependencias](../../docs/seguridad-dependencias.md); evidencia integrada en
  [PR #32](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/32).
  Instalación local en T02 realizada por el responsable. Pruebas/logs usan herramientas nativas.
  **Comprobar:** selección respeta el stack y no incluye ejecutores TS ni frameworks sin necesidad.

- [x] **T02 — Preparar proyecto y compilación.** package.json con ES Modules, lockfile npm y
  tsconfig.json que comprueba tipos y genera dist/ sin emitir ante errores. Añadir `.npmrc`
  con `ignore-scripts=true`; instalar solo lo aprobado, usando `--ignore-scripts`.
  **Comprobar:** compila un módulo mínimo; un error de tipos hace fallar build. Prepara R6/CA6.
  **Evidencia:** npm ls confirma versiones aprobadas; lockfile v3, ignore-scripts=true;
  build genera dist/index.js. Caso temporal TS2322: salida 1, ningún JS emitido,
  archivos de trabajo intactos y limpieza completada. No hay servidor HTTP todavía.

- [x] **T03 — Configurar arranque y logs.** server.ts lee API_CORE_HOST/API_CORE_PORT; app.ts
  crea Express. .env ignorado; variables en el .env.example de la raíz. Local: 127.0.0.1:3002.
  **Comprobar:** escucha local, puerto externo cambiado tras reinicio, fallo explícito para
  configuración inválida o puerto ocupado; logs de arranque/error no exponen secretos. R4/R7; CA4/CA7.
  **Evidencia:** build válido y conexión TCP en 127.0.0.1:3002; reinicio con otro puerto
  configurado correcto. Host/puerto ausentes o inválidos y puerto ocupado terminan con salida 1
  y mensajes seguros. Procesos de verificación cerrados. Las rutas y scripts start/dev siguen pendientes.

- [x] **T04 — Habilitar build/start/dev antes de verificar rutas.** build compila; start ejecuta
  dist/server.js; dev hace build y solo tras su éxito hace start. Incorporar copia del mock
  a dist/data/ cuando el archivo se añada en T07, sin paquete para copiar un archivo.
  **Comprobar:** dev y build/start arrancan; si build falla, dev no inicia JavaScript anterior. R6/CA6.
  **Evidencia:** start carga .env con `node --env-file-if-exists` (sin dotenv; las variables del
  entorno prevalecen). dev y build/start registran escucha y aceptan TCP en 127.0.0.1:3002.
  Con un error de tipos temporal y dist/ previo presente, dev termina con salida 1 sin escuchar.
  Archivo temporal eliminado y procesos de verificación cerrados.

- [ ] **T05 — Incorporar CI inicial de compilación.** Después de aprobar spec/plan/tasks 003,
  aplicar su comprobación de instalación reproducible y build al proyecto que ya existe.
  **Comprobar:** una ejecución válida pasa; un error de tipos falla el job sin desplegar ni
  utilizar credenciales cloud. Esta tarea depende de 003 y no sustituye sus criterios de aceptación.

- [ ] **T06 — Añadir GET /health.** HTTP 200 con status ok en JSON, independiente de datos.
  **Comprobar:** curl.exe al endpoint en 127.0.0.1:3002 devuelve 200 JSON, sin SQL Server. R1/R3; CA1/CA3.

- [ ] **T07 — Añadir equipos mock y su ruta.** data/equipment.json con id/name ficticios;
  routes/equipment.ts lee mediante ruta relativa al módulo. Copiar JSON en build desde ahora.
  **Comprobar:** /api/equipment devuelve 200 y el arreglo esperado en dev y build/start;
  existe dist/data/equipment.json, sin depender de SQL Server. R2/R3/R6; CA2/CA3/CA6.

- [ ] **T08 — Completar errores y diagnóstico.** 404 después de rutas; manejador 500 al final;
  entregar explícitamente errores asíncronos a Express 4 y registrar un evento seguro.
  **Comprobar:** ruta desconocida devuelve 404 JSON. Usar una copia temporal de módulos
  compilados sin equipment.json para verificar 500 genérico y /health disponible, sin modificar
  el mock de trabajo. Limpiar recursos y confirmar respuesta normal con datos presentes;
  logs útiles sin secretos. R5/R7; CA5/CA7.

- [ ] **T09 — Automatizar contratos y errores.** node:test y aserciones/fetch nativos sobre la
  app compilada; casos /health, equipos, 404 y 500 con datos temporales y limpieza garantizada.
  **Comprobar:** npm test pasa tras build; alterar la respuesta esperada hace fallar la prueba.
  No quedan servidores abiertos ni archivos mock modificados. R8/CA8.

- [ ] **T10 — Añadir pruebas a la CI existente.** Ampliar el job de T05 según spec 003;
  ejecutar build y npm test antes del cierre. No crear un workflow duplicado solo para los tests.
  **Comprobar:** check pasa con contratos correctos y falla con un caso incorrecto. Un check
  verde no acredita despliegue ni SQL Server. Cubre 003; evidencia adicional de CA8.

- [ ] **T11 — Documentar operación local.** README de api-core con entorno, dev/build/start/test,
  curl de rutas, logs y cómo diagnosticar un fallo; aclarar que /health no comprueba SQL.
  **Comprobar:** comandos coinciden con package.json y .env.example, sin credenciales. R4/R6/R7.

- [ ] **T12 — Verificar y cerrar 002.** Registrar evidencia de CA1–CA8; ejecutar ambos modos
  y pruebas pendientes/afectadas. Cerrar 003 por sus propios criterios cuando esté verificada.
  **Comprobar:** no marcar Implementada sin evidencia, ni completar T02 de 001 antes de BFF/frontend.
