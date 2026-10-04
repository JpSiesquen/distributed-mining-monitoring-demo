# Tareas 003 — CI mínima de compilación y pruebas

- **Spec:** [003](spec.md)
- **Plan:** [003](plan.md)
- **Estado:** Aprobadas; pendientes de ejecución
- **Fecha:** 2026-10-03

Spec, plan y tareas aprobados el 2026-10-03. Esta lista no habilita Actions ni ejecuta instalaciones.
Las tareas concretan T05 y T10 de 002; no crear workflows duplicados.

- [ ] **T01 — Completar revisión previa.** Verificar versiones/SHA aprobados, notas de cambios,
  seguridad de las acciones y compatibilidad con el runner; revalidar visibilidad y costos.
  Depende de 002/T01 para dependencias exactas y scripts de instalación. Proponer el comando
  `npm ci --ignore-scripts`, su finalidad y dependencias de producción/desarrollo; obtener autorización de ejecución.
  **Comprobar:** aprobaciones y fuentes registradas; no habilitar el workflow con revisión pendiente.
  R4; CA5.

- [ ] **T02 — Crear workflow inicial de build.** Después de 002/T04 y de T01, crear
  .github/workflows/api-core-ci.yml: push a main y pull_request hacia main, un job api-core,
  ubuntu-22.04, contents: read, checkout/setup-node con los SHA del plan, credenciales no
  persistidas y caché de npm desactivada. Preparar Node.js 24.21.0; ejecutar npm ci --ignore-scripts y
  npm run build en api-core/. No llamar npm test antes de existir.
  **Comprobar:** YAML válido, rutas/scripts existentes, versión exacta y permisos mínimos;
  no hay secretos, despliegue, filtros de rutas ni opciones que ignoren fallos. R1/R2/R4; CA5.

- [ ] **T03 — Verificar build y disparadores.** Ejecutar un cambio válido mediante pull request
  hacia main y verificar el push a main al integrar un cambio válido autorizado. Introducir
  un error de tipos controlado en una rama de validación; comprobar el fallo y restaurarlo.
  **Comprobar:** build válido pasa, error de tipos falla, ambos disparadores ejecutan el job;
  logs identifican compilación y no queda el error intencional en main. R3; CA1/CA2/CA4.

- [ ] **T04 — Incorporar pruebas al mismo workflow.** Depende de 002/T09. Añadir npm test
  después de build; coordinar con 002/T10 sin duplicar job o workflow.
  **Comprobar:** se ejecutan las pruebas del JavaScript compilado; comandos obligatorios,
  sin omitir el paso si falta el script ni aceptar una ejecución sin pruebas. R2; CA1/CA3/CA5.

- [ ] **T05 — Verificar fallos de pruebas e instalación.** En una rama de validación, alterar
  temporalmente una expectativa de contrato y comprobar el job fallido. Comprobar además
  que un fallo controlado de npm ci --ignore-scripts termina el job antes de build/pruebas; restaurar los cambios.
  **Comprobar:** los logs distinguen ambos fallos; no se usan continue-on-error ni códigos
  de salida ignorados; el código válido vuelve a pasar sin datos de prueba modificados. R3; CA3/CA4.

- [ ] **T06 — Documentar uso y diagnóstico.** Documentar disparadores, pasos, versiones,
  acceso a logs y diferencia entre build inicial y build con pruebas. Enlazar la evidencia.
  **Comprobar:** resultado verde describe solo las comprobaciones realizadas; no acredita
  SQL Server ni despliegue. Sin secretos o instrucciones incompatibles con el workflow. R3; CA4.

- [ ] **T07 — Verificar y cerrar 003.** Registrar evidencia de CA1–CA5, incluyendo versiones,
  permisos, ejecuciones válidas, fallos controlados y recuperación.
  **Comprobar:** marcar Implementada solo con todos los criterios verificados; sin casillas
  completadas por aprobación documental. La ejecución de las pruebas es necesaria para el cierre.
