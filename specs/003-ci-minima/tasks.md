# Tareas 003 — CI mínima de compilación y pruebas

- **Spec:** [003](spec.md)
- **Plan:** [003](plan.md)
- **Estado:** En ejecución; T01–T04 y T08 completadas. Siguiente: T05 (issue #14), después de #42
- **Fecha:** 2026-10-03

Spec, plan y tareas aprobados el 2026-10-03. Esta lista no habilita Actions ni ejecuta instalaciones.
Las tareas concretan T05 y T10 de 002; no crear workflows duplicados.

- [x] **T01 — Completar revisión previa.** Verificar versiones/SHA aprobados, notas de cambios,
  seguridad de las acciones y compatibilidad con el runner; revalidar visibilidad y costos.
  Depende de 002/T01 para dependencias exactas y scripts de instalación. Proponer el comando
  `npm ci --ignore-scripts`, su finalidad y dependencias de producción/desarrollo; obtener autorización de ejecución.
  **Comprobar:** aprobaciones y fuentes registradas; no habilitar el workflow con revisión pendiente.
  R4; CA5.
  **Evidencia (2026-10-09):** `git ls-remote` confirma que las etiquetas checkout v7.0.1 y
  setup-node v7.0.0 apuntan a los SHA del plan; sin avisos de seguridad publicados ni repositorios
  archivados; action.yml de ambos commits declara node24 y setup-node expone package-manager-cache.
  Se mantiene setup-node v7.0.0: v7.1.0 (publicada el 2026-10-08) no contiene correcciones de
  seguridad. ubuntu-22.04 disponible sin aviso de retiro; vigilar su retiro al publicarse una
  nueva imagen estable. Repositorio público: runners estándar gratuitos según la
  [facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
  GITHUB_TOKEN por defecto de solo lectura y sin aprobación de PR. Acciones restringidas a las
  propias de GitHub con SHA completo obligatorio. `npm ci --ignore-scripts` autorizado sobre las
  dependencias aprobadas en 002/T01 (express de producción; typescript, @types/express y
  @types/node de desarrollo).

- [x] **T02 — Crear workflow inicial de build.** Después de 002/T04 y de T01, crear
  .github/workflows/api-core-ci.yml: push a main y pull_request hacia main, un job api-core,
  ubuntu-22.04, contents: read, checkout/setup-node con los SHA del plan, credenciales no
  persistidas y caché de npm desactivada. Preparar Node.js 24.21.0; ejecutar npm ci --ignore-scripts y
  npm run build en api-core/. No llamar npm test antes de existir.
  **Comprobar:** YAML válido, rutas/scripts existentes, versión exacta y permisos mínimos;
  no hay secretos, despliegue, filtros de rutas ni opciones que ignoren fallos. R1/R2/R4; CA5.
  **Evidencia (2026-10-09):** primera ejecución en pull request correcta en sus cinco pasos.
  El log muestra imagen ubuntu-22.04, GITHUB_TOKEN con Contents: read y Metadata: read,
  persist-credentials: false, node v24.21.0, `npm ci --ignore-scripts` (82 paquetes, 0
  vulnerabilidades reportadas) y `tsc`, sin advertencias ni errores. SHA idénticos al plan,
  sin tabulaciones ni opciones que ignoren fallos. Disparadores y caso fallido: T03.

- [x] **T03 — Verificar build y disparadores.** Ejecutar un cambio válido mediante pull request
  hacia main y verificar el push a main al integrar un cambio válido autorizado. Introducir
  un error de tipos controlado en una rama de validación; comprobar el fallo y restaurarlo.
  **Comprobar:** build válido pasa, error de tipos falla, ambos disparadores ejecutan el job;
  logs identifican compilación y no queda el error intencional en main. R3; CA1/CA2/CA4.
  **Evidencia (2026-10-09):** pull request #38: dos ejecuciones correctas por pull_request.
  Su integración ejecutó el job por push a main, correcto sobre bb9f737. Pull request de
  validación #40 con error de tipos controlado: Build falla con TS2322 y salida 1; los pasos
  previos pasan. Cerrado sin integrar y rama eliminada; el archivo no existe en main.
  El pull request en rojo seguía siendo integrable; la protección de main se aborda en #39.

- [x] **T04 — Incorporar pruebas al mismo workflow.** Depende de 002/T09. Añadir npm test
  después de build; coordinar con 002/T10 sin duplicar job o workflow.
  **Comprobar:** se ejecutan las pruebas del JavaScript compilado; comandos obligatorios,
  sin omitir el paso si falta el script ni aceptar una ejecución sin pruebas. R2; CA1/CA3/CA5.
  **Evidencia (2026-10-10):** paso Test (`npm test`) después de Build en el job api-core, sin
  acciones ni permisos nuevos. Pull request #51: el log de Test muestra 6 pruebas ejecutadas
  sobre dist/, 6 pasan y 0 fallan. `npm test` apunta al archivo exacto: con un patrón sin
  coincidencias Node.js termina con salida 0 y 0 pruebas; con un archivo ausente, salida 1.

- [ ] **T05 — Verificar fallos de pruebas e instalación.** En una rama de validación, alterar
  temporalmente una expectativa de contrato y comprobar el job fallido. Comprobar además
  que un fallo controlado de npm ci --ignore-scripts termina el job antes de build/pruebas; restaurar los cambios.
  **Comprobar:** los logs distinguen ambos fallos; no se usan continue-on-error ni códigos
  de salida ignorados; el código válido vuelve a pasar sin datos de prueba modificados. R3; CA3/CA4.

- [ ] **T06 — Documentar uso y diagnóstico.** Documentar disparadores, pasos, versiones,
  acceso a logs y diferencia entre build inicial y build con pruebas. Enlazar la evidencia.
  **Comprobar:** resultado verde describe solo las comprobaciones realizadas; no acredita
  SQL Server ni despliegue. Sin secretos o instrucciones incompatibles con el workflow. R3; CA4.

- [ ] **T07 — Verificar y cerrar 003.** Registrar evidencia de CA1–CA6, incluyendo versiones,
  permisos, ejecuciones válidas, fallos controlados y recuperación.
  **Comprobar:** marcar Implementada solo con todos los criterios verificados; sin casillas
  completadas por aprobación documental. La ejecución de las pruebas es necesaria para el cierre.

- [x] **T08 — Exigir el check en main.** Depende de T03; se ejecuta antes de las rutas de 002.
  Crear el ruleset del plan sobre la rama por defecto, tras validar su configuración.
  **Comprobar:** un pull request de validación con error de tipos queda bloqueado; un push
  directo a main es rechazado; un pull request con el check exitoso se integra. El pull
  request de validación se cierra sin integrar. R5; CA6.
  **Evidencia (2026-10-09):** ruleset activo sobre la rama por defecto, sin excepciones.
  Pull request de validación #43 con error de tipos: check fallido, estado BLOCKED y merge
  rechazado por la política de la rama; cerrado sin integrar. Push directo de un commit vacío
  a main rechazado con GH013 (pull request y check `api-core` requeridos); main sin cambios.
  La integración de este cambio con el check exitoso completa la verificación.
