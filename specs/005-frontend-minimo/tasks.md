# Tareas 005 — Integración de Mining Ops Console

- **Spec:** [revisión 2](spec.md), aprobada el 2026-10-13.
- **Plan:** [005](plan.md), aprobado el 2026-10-13.
- **Estado:** Aprobadas el 2026-10-13; T01 completada el 2026-10-15, T02 completada; T03 integrada en PR frontend #52; T04 integrada en PR frontend #53; T05 integrada en PR #100; T06 integrada en PR #101 (daf244ea) ; T07 integrada en PR frontend #55 y T08–T15 pendientes.

Una secuencia para dos repos: **backend** = distributed-mining-monitoring-demo;
**frontend** = mining-ops-console. No crear una segunda aplicación frontend aquí.
Las casillas acreditan ejecución, no aprobación documental. Instalaciones, ejecución de CI,
cambios de rulesets y publicación de issues requieren las autorizaciones concretas aplicables.

## Issues de ejecución

Publicado y verificado el 2026-10-13: cinco issues en
[backend](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/milestone/5) y trece en
[frontend](https://github.com/JpSiesquen/mining-ops-console/milestone/1), sin asignar.
T01/T13/T15 se dividen por repo. Prefijos 4-N identifican el orden conjunto, no IDs GitHub.

| Tarea | Backend | Frontend |
|-------|---------|----------|
| T01 | [#93](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/93) | [#36](https://github.com/JpSiesquen/mining-ops-console/issues/36) |
| T02 | — | [#37](https://github.com/JpSiesquen/mining-ops-console/issues/37) |
| T03 | — | [#38](https://github.com/JpSiesquen/mining-ops-console/issues/38) |
| T04 | — | [#39](https://github.com/JpSiesquen/mining-ops-console/issues/39) |
| T05 | [#94](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/94) | — |
| T06 | [#95](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/95) | — |
| T07 | — | [#40](https://github.com/JpSiesquen/mining-ops-console/issues/40) |
| T08 | — | [#41](https://github.com/JpSiesquen/mining-ops-console/issues/41) |
| T09 | — | [#42](https://github.com/JpSiesquen/mining-ops-console/issues/42) |
| T10 | — | [#43](https://github.com/JpSiesquen/mining-ops-console/issues/43) |
| T11 | — | [#44](https://github.com/JpSiesquen/mining-ops-console/issues/44) |
| T12 | — | [#45](https://github.com/JpSiesquen/mining-ops-console/issues/45) |
| T13 | [#96](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/96) | [#46](https://github.com/JpSiesquen/mining-ops-console/issues/46) |
| T14 | — | [#47](https://github.com/JpSiesquen/mining-ops-console/issues/47) |
| T15 | [#97](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/97) | [#48](https://github.com/JpSiesquen/mining-ops-console/issues/48) |

Las antiguas #70–#79 se cerraron como sustituidas, con enlaces a los reemplazos, y salieron
del milestone activo. Su cierre no acredita implementación. T01–T07 completadas; T08–T15 pendientes de cierre;
la corrección editorial del frontend en PR #35 no completa el contrato ni la integración.

## Secuencia y comprobaciones

- [x] **T01 — Alinear contrato y documentación de ambos repos.** Backend: crear
  docs/contratos/eventos-v1.md desde el plan aprobado, con ejemplos sintéticos válidos/ inválidos;
  registrar ADR de repos/CI y ampliaciones 002/004. Frontend: revisar docs/spec.md y tasks/plan.md,
  referenciar contrato y mantener el demo histórico diferenciado. Proponer reconciliación de issues.
  **Comprobar:** mismas rutas/campos/reglas/UTC/evidencia en ambos documentos; ninguna tarea crea
  frontend duplicado ni exige su check en backend. Reglas heredadas revisadas, sin material restringido.
  **Cobertura:** R1/R2/R9; CA1. Prerrequisito documental de la implementación.
  **Evidencia:** backend [PR #99](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/99),
  merge 3de8694, integra contrato [eventos v1](../../docs/contratos/eventos-v1.md) y
  [ADR 0012](../../docs/adr/0012-repositorios-separados-y-contrato-eventos.md).
  Frontend [PR #50](https://github.com/JpSiesquen/mining-ops-console/pull/50), merge 15afc15a,
  referencia esa revisión inmutable; preview y producción Vercel verificados. #93/#36 cerradas.
  CA1 cumplido; endpoints/validadores e integración HTTP siguen pendientes.

- [x] **T02 — Revisar dependencias y autorizar comandos del frontend.** Revisar package.json,
  lockfile y grafo existente; compatibilidad React19/Vite6/Node24.21.0, MUI/Emotion, Query,
  PDF y Vitest/RTL/jsdom. Verificar scripts transitivos, incluidos esbuild/fsevents; registrar
  finalidad, tipo, versión y comando exactos antes de instalar/ejecutar. Revalidar cambios de grafo.
  **Comprobar:** selección sin paquetes anticipados; ignore-scripts no se desactiva; cualquier
  script necesario tiene necesidad/contenido/comando revisados y aprobados. Sin credenciales.
  **Depende:** T01. **Cobertura:** R10; habilita T03, sin instalar en esta tarea.
  **Avance:** corrección del grafo existente integrada en
  [frontend PR #49](https://github.com/JpSiesquen/mining-ops-console/pull/49), con build correcto.
  Selección y comandos aprobados; revisión completa integrada en [frontend PR #51](https://github.com/JpSiesquen/mining-ops-console/pull/51), merge 9e243722. #37 cerrada; producción READY y alias contrastados. La instalación corresponde a T03.

- [x] **T03 — Establecer baseline compilable del frontend existente.** Preparar .npmrc,
  engines/scripts finitos, configuración de tipos y herramientas autorizadas sin regenerar el repo.
  Ejecutar solo comandos aprobados, contrastar lockfile y documentar revisión. Registrar baseline
  de pantallas/dominio con acceso permitido; corregir fallos identificados antes de migrar.
  **Comprobar:** build produce dist; tipo incorrecto falla antes del empaquetado; fuente restaurada.
  No asumir que el demo ya compila o que sus decisiones son correctas. Entorno sin secretos.
  **Depende:** T02. **Cobertura:** R6/R8/R10; prepara CA6/CA7/CA8.
  **Evidencia (2026-10-16):** instalación con scripts bloqueados, grafo contrastado, build correcto y TS2322 con restauración. PDF descargado con imágenes según el usuario; aviso Buffer preexistente registrado para #45. [Frontend PR #52](https://github.com/JpSiesquen/mining-ops-console/pull/52) integrado, merge 5172e9f7; #38 cerrada, producción READY y alias verificados.

- [x] **T04 — Introducir CI inicial en el repo frontend.** Revalidar Actions/SHA, comandos,
  runtime y cuotas/costos del repo privado; preparar job frontend de build con controles npm,
  permisos mínimos y cinco minutos. Autorizar ejecución concreta antes de habilitarla; validar
  caso correcto y fallo de tipos antes de exigir check en su ruleset. Backend conserva sus dos checks.
  **Comprobar:** falta de política falla antes de instalar; build incorrecto bloquea el PR del
  frontend; recuperación verificada, negativos sin integrar. Sin tokens entre repos ni despliegue.
  **Depende:** T03. **Cobertura:** R8/R10; CA8 parcial.
  **Evidencia (2026-10-16):** [frontend PR #53](https://github.com/JpSiesquen/mining-ops-console/pull/53), head 9c45cafb, check frontend/Vercel verdes. Correcto 38914865846; TS2322 38915009193; política ausente 38915155808 (instalación/build omitidos); recuperación 38915316327; head final correcto 38915533974. Ruleset 25246100 exige PR/frontend, sin force push/eliminación; #54 BLOCKED y cerrado restaurado sin integrar. PR #53 integrado en 88d5b589; #39 cerrada, CI main 38920171582 correcta y producción verificada. [Registro](https://github.com/JpSiesquen/mining-ops-console/blob/9c45cafb31e4195456d0d6c597a70cfcaf60ad27/docs/ci.md).

- [x] **T05 — Entregar eventos desde API Core.** Backend: fixture sintético events.json,
  validación explícita y GET /api/events; asegurar copia del JSON al artefacto compilado.
  No copiar datos del cliente ni derivar clasificaciones/turnos reales. Incorporar pruebas nativas.
  **Comprobar:** arreglo/orden/folios únicos, vacío y reglas de contrato; fixture ausente/ inválido
  causa 500 seguro. Health/equipment y pruebas previas siguen pasando; sin SQL ni paquetes nuevos.
  **Depende:** T01. **Cobertura:** R1/R2/R3; CA1/CA2.
  **Decisión (2026-10-16):** evidencia nula hasta T11; imágenes no catalogadas rechazadas, metadatos comprobados con catálogo aislado de pruebas. No se copian imágenes de faena.
  **Evidencia:** [PR #100](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/100); build y 65 pruebas locales correctas en copia sin entorno real. [CI 38921955929](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38921955929) correcta con api-core/bff. Contrato, JSON copiado, vacío, orden/empates, rechazo íntegro y 500/logs seguros verificados; sin paquetes nuevos. PR #100 integrado en b774cf38; #94 cerrada y CI main 38923275808 correcta. #95 integrada en PR #101.

- [x] **T06 — Exponer eventos a través del BFF.** Backend: nueva ruta y validación de JSON;
  usar timeout existente, rechazo de redirecciones y mensajes/logs seguros. Añadir pruebas HTTP.
  **Comprobar:** contrato válido/vacío; fuente caída, estado/JSON/contrato inválidos → 502;
  demora de cabeceras/cuerpo → 504. Health/equipment permanecen correctos. Fuente real API Core
  consultada por HTTP; BFF no lee fixture ni accede a SQL. Integrar proveedor antes del consumidor.
  **Depende:** T05. **Cobertura:** R1/R2/R3/R8; CA2 y prerrequisito CA3.
  **Avance local (2026-10-16):** build y 46 pruebas BFF correctos; integración reproducible con API Core compilado real por HTTP, incluyendo eventos/equipos, caída → 502 y health disponible. Sin paquetes, acceso a fixtures desde BFF ni cambios del workflow. Ver [operación](../../bff/README.md#eventos-de-lectura--95). [PR #101](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/101); [CI 38924815677](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38924815677) correcta con api-core/bff. Integrado en daf244ea; #95 cerrada y CI main 38929191630 correcta.

- [x] **T07 — Preparar consulta y contrato en frontend.** Crear src/api/events.ts,
  validador y consulta Query; proxy dev/preview con BFF_URL validado, escucha/puertos aprobados,
  strictPort y destino fuera del bundle. Adaptar tipos sin añadir paquete compartido.
  **Comprobar:** JSON inválido rechazado; diez segundos incluyen cuerpo y cancelación; reintento
  explícito sin retries/refetch automáticos. Pruebas controladas de fuente vacía/red/error/demora;
  configuración inválida falla claramente. No declarar integración de pantallas todavía.
  **Depende:** T03/T04/T06. **Cobertura:** R2/R5/R7; prepara CA3/CA5/CA7.
  **Avance local (2026-10-16):** frontend #40 preparado sobre 88d5b589; build y 44 pruebas correctos. Consulta/validación/Query y proxy dev/preview verificados; sin dependencias nuevas ni pantallas conectadas. [PR frontend #55](https://github.com/JpSiesquen/mining-ops-console/pull/55) publicado con autorización, head 51e2483c; CI 38931642622 correcta y preview READY. Integrado con autorización en c1148ade74b6b3741a07f3c6de18d81c7df6d257; #40 cerrada. CI main 38939401761 correcta; producción READY y alias contrastados con ese merge. T07 completada, T08 no iniciada. Las 44 pruebas son locales; CI solo build hasta #46.

- [ ] **T08 — Conectar App y composición Material UI.** ThemeProvider/QueryClientProvider,
  tema oscuro/ámbar, cabecera/navegación y estados globales. App consume consulta; selección por
  folio, sin copiar estado remoto. Retirar seed/simulador y sonido/popups de falsa ingesta en este
  recorrido. Deshabilitar tomar/cerrar; no presentar vistas aún sin adaptar como integración terminada.
  **Comprobar:** carga/vacío/error/reintento accesibles; caída no usa seed ni datos anteriores
  como vigentes. Acciones explicadas/deshabilitadas, sin escrituras en memoria. Pruebas DOM.
  **Depende:** T07. **Cobertura:** R4/R5/R6; CA3/CA5/CA6 parcial.
  **Avance local (2026-10-16):** #41 preparada sobre frontend c1148ade; build y 55 pruebas correctos (once DOM). App remota/MUI, selección por folio, estados y atención de solo lectura. Exportación sin habilitar hasta #45 para evitar cifras fijas heredadas. [PR frontend #56](https://github.com/JpSiesquen/mining-ops-console/pull/56) publicado como borrador en 2d10f113; CI 38962269771 correcta y preview READY/SHA contrastado. Chrome local: seis eventos, detalle/solo lectura, Escape y caída/recuperación real de API Core correctos; servidores detenidos. Vercel sigue mostrando código de acceso; App autenticada sin revisar. Producción conserva c1148ade. No acredita revisión responsive completa ni T14 completa; T08 abierta. No integrar en main mientras el despliegue Vercel carezca de ruta de mismo origen al BFF; el proxy local no se publica en dist.

- [ ] **T09 — Adaptar panel de alertas a Material UI.** Migrar PanelAlertas/TarjetaEvento/
  BadgeEstado; revisar reglas de prioridad y conteos, sin conservarlas solo por existir.
  **Comprobar:** orden/contadores corresponden a datos recibidos; estados con texto, teclado
  y foco, nombres largos y vacío explicado. Pruebas de orden/conteo y revisión visual 360/1280 px.
  **Depende:** T08. **Cobertura:** R4/R6; CA3/CA4/CA6 parcial.
  **Avance local (2026-10-16):** #42 preparada con autorización sobre PR #56 (2d10f113), sin integrar T08. Build y 65 pruebas correctos (diez del panel); prioridad/conteos/teclado/nombres largos comprobados. DOM/layout de Chrome a 360/1280 px efectivos sin desbordamiento; capturas fallaron, no se aportan imágenes de revisión. Fixture restaurado, viewport restablecido y servidores detenidos. [PR frontend #57](https://github.com/JpSiesquen/mining-ops-console/pull/57) publicado como borrador sobre #56, head inicial cb235522; ahora incluye #43 mediante merge d6c239d1, con preview READY/SHA contrastado. Actions no ejecutado por filtro main, pendiente antes de integrar a main. App autenticada del preview sin revisar; producción c1148ade sin cambios. T09 abierta, sin merge.

- [ ] **T10 — Adaptar histórico, filtros y fechas UTC.** Migrar Historico/Filtros a Material
  UI y revisar formato/periodo. Filtros se calculan sobre eventos recibidos, sin peticiones por
  pulsación. Distinguir ausencia de fuente y filtro sin coincidencias; permitir restablecer filtros.
  **Comprobar:** valores/contadores/lista coinciden; orden cronológico estable, UTC visible,
  límites de medianoche y periodos vacíos/ inválidos correctos. Pruebas DOM y teclado/visual.
  **Depende:** T09. **Cobertura:** R4/R6; CA3/CA4/CA6 parcial.
  **Avance local (2026-10-16):** #43 preparada sobre PR #57 (cb235522), sin integrar T08/T09. Histórico/filtros MUI, vacío/restablecimiento y calendario/periodos UTC verificados. Build y 81 pruebas correctos (dieciséis nuevos); Chrome con servicios reales a 360/1280 px, scroll contenido y teclado. Capturas observadas; viewport restablecido, servidores detenidos. Aviso chunk 524,42 kB documentado. Sin cambio de zona de operación. [PR frontend #58](https://github.com/JpSiesquen/mining-ops-console/pull/58) integrado únicamente en la rama de #57, merge d6c239d1; árbol idéntico al head validado 4b90509d y preview del merge READY/SHA contrastado. Actions no ejecutado por filtro main; App autenticada sin revisar (login Vercel en navegador integrado). Producción c1148ade intacta; #43/T10 abiertas hasta entrega en main.

- [ ] **T11 — Adaptar detalle y evidencia sintética.** Migrar DetalleEvento/controles a MUI
  Dialog; preparar ilustraciones de demostración bajo /evidencia/demo/ y catálogo de rutas
  coincidente con fixtures. Mantener recuadros desde datos, imagen completa/recorte y atención solo lectura.
  **Comprobar:** foco/Escape/retorno al disparador; recuadros válidos; ausencia/fallo de imagen
  explicado. Sin URLs arbitrarias ni material real; al cambiar folio no queda detalle/encuadre viejo.
  Verificación real de imágenes y pruebas DOM; tomar/cerrar siguen deshabilitados.
  **Depende:** T10. **Cobertura:** R2/R4/R5/R6/R10; CA3/CA5/CA6 parcial.
    **Avance local (2026-10-16):** preparada sobre PR #57 (d6c239d1). Catálogo
    aprobado coordinado: un PNG sintético 1672×941 para EV-20261015-0002, resto sin imagen.
    Build y 90 pruebas frontend, 65 API Core, 47 BFF e integración HTTP real correctos.
    Navegador a 360/1280 px: recorte/completa, foco/Escape/retorno, reapertura/cambio de folio,
    ausencia y fallo real sin recuadros; archivo restaurado y hash contrastado. Canvas y PDF
    de compatibilidad correctos; reporte completo pendiente de T12. Servicios detenidos,
    viewport restaurado; aviso chunk 529,58 kB. Sin dependencias ni cambios de producción.
    [PR backend #102](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/102) y [PR frontend #59](https://github.com/JpSiesquen/mining-ops-console/pull/59) publicados con autorización; frontend borrador en 81050e9b. Preview READY/SHA y producción intacta verificados. Actions frontend no ejecutado por filtro main; App del preview sin revisar por login Vercel. Sin merge;
    T11 permanece abierta hasta entrega y comprobaciones de integración.
    **Integración (2026-10-17):** backend PR #102 integrado en main (0a280a64), CI main 39069149305 correcta. Frontend PR #59 integrado únicamente en la rama de #57 (6e1084ed); main/producción c1148ade intactos y #44 abierta. Pausa solicitada; T12 no iniciada. Preview del merge frontend correcto según Vercel en GitHub; árbol idéntico al validado de #59. Consulta adicional CLI Vercel agotó 45 s, sin reintento: alias actual no reconsultado. No se acredita revisión de App autenticada.

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
  **Depende:** T04/T06 para el adelanto aprobado; T12 para completar la cobertura y cerrar.
  **Cobertura:** R8/R10; CA8.
  **Ajuste aprobado (2026-10-17):** #45/T12 pospuesta. Adelantar en #46 la suite existente
  con `npm test` después del build y ejecutar `pull_request` hacia cualquier rama para validar
  PR dependientes; `push` sigue limitado a main. Conservar job frontend, controles npm,
  SHA de Actions, Node/Ubuntu, lectura, límite de cinco minutos y ruleset. Preparación local
  autorizada; publicación/ejecución en GitHub pendientes de autorización. Casos negativos
  temporales sin integrar. Build y npm test (90/90) correctos localmente, lockfile sin cambios;
  no se ejecutó CI remota de este adelanto. No cerrar #46/T13, CA8, T14 ni T15 sin completar T12.

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
