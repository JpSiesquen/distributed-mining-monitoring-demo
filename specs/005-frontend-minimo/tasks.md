# Tareas 005 — Integración de Mining Ops Console

- **Spec:** [revisión 2](spec.md), aprobada el 2026-10-13.
- **Plan:** [005](plan.md), aprobado el 2026-10-13.
- **Estado:** Aprobadas el 2026-10-13; T01–T15 pendientes de ejecución.

Una secuencia para dos repos: **backend** = distributed-mining-monitoring-demo;
**frontend** = mining-ops-console. No crear una segunda aplicación frontend aquí.
Las casillas acreditan ejecución, no aprobación documental. Instalaciones, ejecución de CI,
cambios de rulesets y publicación de issues requieren las autorizaciones concretas aplicables.

## Backlog anterior

#70–#79 y milestone Fase 4 describen el dashboard original; no corresponden automáticamente
a estas quince tareas. Propuesta preparada: cinco issues backend y trece frontend;
T01/T13/T15 se dividen por repo. Publicación y reconciliación pendientes de autorización,
con enlaces de dependencia y trazabilidad hacia los reemplazos de las issues anteriores.
No cerrar, trasladar ni publicar issues por redactar este documento. El historial conserva T01–T10 originales.

## Secuencia y comprobaciones

- [ ] **T01 — Alinear contrato y documentación de ambos repos.** Backend: crear
  docs/contratos/eventos-v1.md desde el plan aprobado, con ejemplos sintéticos válidos/ inválidos;
  registrar ADR de repos/CI y ampliaciones 002/004. Frontend: revisar docs/spec.md y tasks/plan.md,
  referenciar contrato y mantener el demo histórico diferenciado. Proponer reconciliación de issues.
  **Comprobar:** mismas rutas/campos/reglas/UTC/evidencia en ambos documentos; ninguna tarea crea
  frontend duplicado ni exige su check en backend. Reglas heredadas revisadas, sin material restringido.
  **Cobertura:** R1/R2/R9; CA1. Prerrequisito documental de la implementación.

- [ ] **T02 — Revisar dependencias y autorizar comandos del frontend.** Revisar package.json,
  lockfile y grafo existente; compatibilidad React19/Vite6/Node24.21.0, MUI/Emotion, Query,
  PDF y Vitest/RTL/jsdom. Verificar scripts transitivos, incluidos esbuild/fsevents; registrar
  finalidad, tipo, versión y comando exactos antes de instalar/ejecutar. Revalidar cambios de grafo.
  **Comprobar:** selección sin paquetes anticipados; ignore-scripts no se desactiva; cualquier
  script necesario tiene necesidad/contenido/comando revisados y aprobados. Sin credenciales.
  **Depende:** T01. **Cobertura:** R10; habilita T03, sin instalar en esta tarea.

- [ ] **T03 — Establecer baseline compilable del frontend existente.** Preparar .npmrc,
  engines/scripts finitos, configuración de tipos y herramientas autorizadas sin regenerar el repo.
  Ejecutar solo comandos aprobados, contrastar lockfile y documentar revisión. Registrar baseline
  de pantallas/dominio con acceso permitido; corregir fallos identificados antes de migrar.
  **Comprobar:** build produce dist; tipo incorrecto falla antes del empaquetado; fuente restaurada.
  No asumir que el demo ya compila o que sus decisiones son correctas. Entorno sin secretos.
  **Depende:** T02. **Cobertura:** R6/R8/R10; prepara CA6/CA7/CA8.

- [ ] **T04 — Introducir CI inicial en el repo frontend.** Revalidar Actions/SHA, comandos,
  runtime y cuotas/costos del repo privado; preparar job frontend de build con controles npm,
  permisos mínimos y cinco minutos. Autorizar ejecución concreta antes de habilitarla; validar
  caso correcto y fallo de tipos antes de exigir check en su ruleset. Backend conserva sus dos checks.
  **Comprobar:** falta de política falla antes de instalar; build incorrecto bloquea el PR del
  frontend; recuperación verificada, negativos sin integrar. Sin tokens entre repos ni despliegue.
  **Depende:** T03. **Cobertura:** R8/R10; CA8 parcial.

- [ ] **T05 — Entregar eventos desde API Core.** Backend: fixture sintético events.json,
  validación explícita y GET /api/events; asegurar copia del JSON al artefacto compilado.
  No copiar datos del cliente ni derivar clasificaciones/turnos reales. Incorporar pruebas nativas.
  **Comprobar:** arreglo/orden/folios únicos, vacío y reglas de contrato; fixture ausente/ inválido
  causa 500 seguro. Health/equipment y pruebas previas siguen pasando; sin SQL ni paquetes nuevos.
  **Depende:** T01. **Cobertura:** R1/R2/R3; CA1/CA2.

- [ ] **T06 — Exponer eventos a través del BFF.** Backend: nueva ruta y validación de JSON;
  usar timeout existente, rechazo de redirecciones y mensajes/logs seguros. Añadir pruebas HTTP.
  **Comprobar:** contrato válido/vacío; fuente caída, estado/JSON/contrato inválidos → 502;
  demora de cabeceras/cuerpo → 504. Health/equipment permanecen correctos. Fuente real API Core
  consultada por HTTP; BFF no lee fixture ni accede a SQL. Integrar proveedor antes del consumidor.
  **Depende:** T05. **Cobertura:** R1/R2/R3/R8; CA2 y prerrequisito CA3.

- [ ] **T07 — Preparar consulta y contrato en frontend.** Crear src/api/events.ts,
  validador y consulta Query; proxy dev/preview con BFF_URL validado, escucha/puertos aprobados,
  strictPort y destino fuera del bundle. Adaptar tipos sin añadir paquete compartido.
  **Comprobar:** JSON inválido rechazado; diez segundos incluyen cuerpo y cancelación; reintento
  explícito sin retries/refetch automáticos. Pruebas controladas de fuente vacía/red/error/demora;
  configuración inválida falla claramente. No declarar integración de pantallas todavía.
  **Depende:** T03/T04/T06. **Cobertura:** R2/R5/R7; prepara CA3/CA5/CA7.

- [ ] **T08 — Conectar App y composición Material UI.** ThemeProvider/QueryClientProvider,
  tema oscuro/ámbar, cabecera/navegación y estados globales. App consume consulta; selección por
  folio, sin copiar estado remoto. Retirar seed/simulador y sonido/popups de falsa ingesta en este
  recorrido. Deshabilitar tomar/cerrar; no presentar vistas aún sin adaptar como integración terminada.
  **Comprobar:** carga/vacío/error/reintento accesibles; caída no usa seed ni datos anteriores
  como vigentes. Acciones explicadas/deshabilitadas, sin escrituras en memoria. Pruebas DOM.
  **Depende:** T07. **Cobertura:** R4/R5/R6; CA3/CA5/CA6 parcial.

- [ ] **T09 — Adaptar panel de alertas a Material UI.** Migrar PanelAlertas/TarjetaEvento/
  BadgeEstado; revisar reglas de prioridad y conteos, sin conservarlas solo por existir.
  **Comprobar:** orden/contadores corresponden a datos recibidos; estados con texto, teclado
  y foco, nombres largos y vacío explicado. Pruebas de orden/conteo y revisión visual 360/1280 px.
  **Depende:** T08. **Cobertura:** R4/R6; CA3/CA4/CA6 parcial.

- [ ] **T10 — Adaptar histórico, filtros y fechas UTC.** Migrar Historico/Filtros a Material
  UI y revisar formato/periodo. Filtros se calculan sobre eventos recibidos, sin peticiones por
  pulsación. Distinguir ausencia de fuente y filtro sin coincidencias; permitir restablecer filtros.
  **Comprobar:** valores/contadores/lista coinciden; orden cronológico estable, UTC visible,
  límites de medianoche y periodos vacíos/ inválidos correctos. Pruebas DOM y teclado/visual.
  **Depende:** T09. **Cobertura:** R4/R6; CA3/CA4/CA6 parcial.

- [ ] **T11 — Adaptar detalle y evidencia sintética.** Migrar DetalleEvento/controles a MUI
  Dialog; preparar ilustraciones de demostración bajo /evidencia/demo/ y catálogo de rutas
  coincidente con fixtures. Mantener recuadros desde datos, imagen completa/recorte y atención solo lectura.
  **Comprobar:** foco/Escape/retorno al disparador; recuadros válidos; ausencia/fallo de imagen
  explicado. Sin URLs arbitrarias ni material real; al cambiar folio no queda detalle/encuadre viejo.
  Verificación real de imágenes y pruebas DOM; tomar/cerrar siguen deshabilitados.
  **Depende:** T10. **Cobertura:** R2/R4/R5/R6/R10; CA3/CA5/CA6 parcial.

- [ ] **T12 — Adaptar reporte y verificar PDF.** Migrar VistaReporte/BotonReporte a MUI;
  conservar carga diferida y renderizador/estilos PDF propios. Revisar Portada/config para retirar
  KPI fijos/cifras de jornada sin fuente. Conteos del periodo recibido, UTC y datos sintéticos explícitos.
  **Comprobar:** documento descargado contiene cifras/fechas/eventos correctos; ilustra evidencia
  aprobada o explica ausencia/fallo, no finge mediciones. Periodo vacío/ inválido y consulta fallida
  no generan reporte engañoso. Verificar descarga, liberación Blob, teclado y navegador real.
  **Depende:** T11. **Cobertura:** R4/R5/R6/R10; CA4/CA5/CA6.

- [ ] **T13 — Completar pruebas y bloqueo en CI de ambos repos.** Consolidar suites de
  proveedor/DOM; añadir test al job frontend autorizado. Verificar correctos y fallos separados
  de expectativa, política npm e instalación; documentar etapas omitidas y recuperación.
  **Comprobar:** cada PR bloqueado por los checks de su repo; api-core/bff conservados,
  frontend requerido en el suyo. Casos negativos sin integrar, recursos limpios. Sin SQL/secrets/dispatch.
  **Depende:** T04/T06/T12. **Cobertura:** R8/R10; CA8.

- [ ] **T14 — Acreditar la pareja frontend/backend real.** Ejecutar dev y build/preview con
  BFF/API Core reales y datos ficticios. Registrar ambos SHA completos y revisión del contrato;
  inspeccionar red y comprobar fallos/recuperación, filtros, detalle y PDF. Corregir defectos.
  **Comprobar:** solo BFF como destino de datos; pantallas 360/1280 px y teclado; misma UTC y
  cifras en pantalla/PDF; sin fallback ni escrituras simuladas. No sustituir esta evidencia por mocks.
  **Depende:** T13. **Cobertura:** R1–R9; CA3–CA8.

- [ ] **T15 — Documentar operación, compatibilidad y cierre.** README de ambos repos con
  arranque/configuración/diagnóstico, contrato y pareja validada; evidencia por CA y recuperación
  usando versión identificada, sin reset/force push. Actualizar estados y backlog reconciliado.
  **Comprobar:** CA1–CA9 acreditados antes de marcar 005 implementada; cambios coinciden con
  código/lockfiles/CI. 001/T02 queda pendiente si no se comprobó también su vista de equipos.
  Atención persistente, SQL y despliegue siguen pendientes; no crear otra fase por esta redacción.
  **Depende:** T14. **Cobertura:** R1–R10; CA9 y cierre de todos los criterios.

## Orden resumido

Contrato/documentos → revisión de seguridad → baseline/CI frontend → proveedor API Core/BFF
→ consulta frontend → composición MUI → panel → histórico → detalle/evidencia → reporte
→ pruebas/CI → pareja real → operación/cierre.

T05/T06 pueden prepararse después de T01 con dependencias backend previamente aprobadas;
T07 no comienza hasta tener proveedor integrado y base/CI frontend verificadas. Una aprobación
no marca casillas: toda tarea debe aportar su evidencia en el repo donde se ejecuta.
