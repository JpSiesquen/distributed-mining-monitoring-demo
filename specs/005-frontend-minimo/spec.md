# Spec 005 — Integración de Mining Ops Console

- **Estado:** Revisión 2 aprobada el 2026-10-13; implementación pendiente.
- **Decisiones aprobadas:** frontend en repo separado; primera entrega de lectura;
  atención/cierre persistentes después; mantener Material UI y adaptar la consola.
- La aprobación de esta revisión no aprueba todavía su plan ni ejecución.

## Motivo del cambio

La revisión anterior proponía crear un dashboard de equipos id/name dentro de este repo.
Se reutilizará la consola React/TypeScript de `mining-ops-console`, con panel de eventos,
histórico, detalle y reporte. Su fuente actual y las acciones son simuladas/en memoria;
la integración sustituirá esa fuente por HTTP. Git conserva la revisión anterior.

El frontend permanece en su repo; este mantiene API Core, BFF e infraestructura.
Los servicios se comunican mediante contratos HTTP. Las tareas/issues #70–#79 necesitan
adaptación antes de ejecutarse; crear un frontend nuevo ya no es el resultado acordado.

## Objetivo

Verificar panel, histórico, detalle y reporte con eventos recibidos exclusivamente del BFF,
que consulta API Core. Adaptar la presentación a Material UI conservando identidad industrial,
reglas de dominio aplicables y accesibilidad. Registrar la pareja de versiones probada.

## Alcance

Incluye contrato de lectura de eventos, proveedor API Core/BFF con datos ficticios,
integración de la consola existente, Material UI, filtros/contadores/reportes, estados de
carga/vacío/error, recuperación, configuración externa, pruebas y CI por repositorio.

Queda para entregas posteriores: atención/cierre persistentes, identidad/autorización de
operadores, SQL, ingesta real, MQTT, actualización continua, inferencia, 3D, Docker y despliegue.
La consulta inicial no se presentará como tiempo real. No copiar material restringido al
repo público; usar evidencia sintética/autorizada. Conservar identificación de datos simulados.

## Requisitos

- **R1 — Separación:** el navegador consulta únicamente BFF; BFF consulta API Core, sin SQL
  ni mock propio de operación. Conservar `/api/equipment` id/name y pruebas existentes.
- **R2 — Contrato:** acordar ruta, campos, null/opcionales, estados/categorías, fechas y zona
  horaria, rangos, orden, respuesta vacía y errores antes de implementar. Partir de EventoCruce;
  no asumir relación con los equipos actuales. Ambos repos referencian la misma revisión.
  Validar JSON en ejecución: una interfaz TypeScript no valida datos recibidos.
- **R3 — Proveedor:** API Core suministra eventos ficticios reproducibles; BFF valida y
  expone el contrato. No incorporar SQL por esta migración. Acordar acceso/formato de evidencia.
- **R4 — Lectura:** panel prioriza según dominio; histórico filtra; detalle muestra los
  campos/evidencia disponibles; reporte usa el periodo seleccionado y datos recibidos.
  Contadores y cifras no incorporan agregados inventados. Mantener las limitaciones del producto.
- **R5 — Recuperación:** distinguir carga, fuente vacía, filtro vacío y fallo; red, estado
  HTTP, JSON/contrato inválido o espera agotada no se presentan como éxito. Reintento explícito,
  sin fallback al seed. Retirar simulador del recorrido integrado. Tomar/cerrar quedan
  deshabilitados con explicación hasta implementar persistencia; no simular éxito de escritura.
- **R6 — Presentación:** adaptar por pantallas a Material UI, tema industrial oscuro/ámbar,
  jerarquía y densidad adecuadas. Preservar filtros, diálogo y evidencia; teclado, foco,
  nombres accesibles, significado sin depender del color y respeto de movimiento reducido.
- **R7 — Configuración:** entrada local de mismo origen mediante proxy Vite; destino BFF
  externo al bundle. Mantener escucha/puertos y timeout aprobados salvo revisión explícita.
  No llevar credenciales al navegador ni asumir que middleware Vercel resuelve seguridad on-premise.
- **R8 — Verificación:** frontend tiene build/pruebas DOM en su repo; backend conserva
  comprobaciones y añade pruebas del proveedor. Validar checks propios antes de exigirlos en
  cada repo; planificar workflows/rulesets antes de cambiarlos. Verificar además el recorrido
  frontend → BFF → API Core real: CI verde separada no acredita integración.
- **R9 — Compatibilidad:** primero proveedor compatible, después consumidor. Registrar SHA
  frontend, SHA backend y revisión del contrato. Conservar versión validada anterior para
  recuperación; evitar cambios incompatibles antes de migrar consumidores. Una ejecución
  local por repo basta para esta entrega; repos separados no equivalen a entornos separados.
- **R10 — Seguridad:** revisar grafo y scripts de dependencias existentes/nuevas antes de
  instalar o ejecutar; aplicar política Shai-Hulud e ignore-scripts. Aprobar comandos exactos
  y scripts necesarios. Sin credenciales sensibles ni evidencia restringida en verificaciones.

## Criterios de aceptación

- [x] **CA1:** contrato documentado con ejemplos ficticios válidos/ inválidos; ambos repos
  referencian la misma revisión. Ruta, fechas y evidencia acordadas antes de implementar.
  Evidencia: backend [PR #99](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/99)
  y frontend [PR #50](https://github.com/JpSiesquen/mining-ops-console/pull/50), integrados;
  frontend fija el contrato al commit backend 3de8694. Resto de criterios pendiente.
- [ ] **CA2:** proveedor API Core → BFF cumple contrato y conserva equipos/health; pruebas
  cubren vacío, datos inválidos, indisponibilidad y timeout de cabeceras/cuerpo.
- [ ] **CA3:** panel/histórico/detalle usan eventos del BFF; inspección de red confirma que
  no se consulta API Core directamente ni se usa seed/simulador en el recorrido integrado.
- [ ] **CA4:** prioridad, filtros y contadores corresponden a eventos recibidos; PDF refleja
  periodo, datos y evidencia autorizada, sin cifras ajenas a la fuente.
- [ ] **CA5:** carga/vacío/filtro vacío/error son distintos; recuperación y reintento permiten
  continuar sin éxito ficticio. Tomar/cerrar no producen escrituras simuladas.
- [ ] **CA6:** pantallas Material UI verificadas a 360/1280 px y por teclado, sin pérdida de
  contenido, desbordamiento horizontal ni regresiones de diálogo/evidencia.
- [ ] **CA7:** dev y build/preview usan backend real y configuración externa; sin secretos en
  bundle/logs. Evidencia identifica ambos SHA y revisión del contrato probados.
- [ ] **CA8:** build y pruebas DOM/proveedor pasan en sus repos; fallos controlados bloquean
  el PR correspondiente. Checks y recuperación contrastados sin integrar casos negativos.
- [ ] **CA9:** operación, configuración, compatibilidad y recuperación documentadas en ambos
  repos. 001/T02 solo se completa con la vista de equipos y restantes requisitos de esa tarea;
  consultar eventos no sustituye esa evidencia ni acredita SQL/despliegue/DEV/QA.

## Decisiones y preguntas para el plan

- Aprobado el 2026-10-13: dos repos; lectura en panel, histórico, detalle y reporte primero;
  atención/cierre persistentes después.
- Aprobado el 2026-10-13: mantener Material UI y adaptar la consola; CSS Modules no será
  la solución final de las pantallas migradas. Concretar sustitución por pantalla en el plan.
- Aprobado el 2026-10-13: GET /api/events devuelve arreglo directo; fechas ficticias en UTC
  explícita y presentación UTC. La zona real de faena se definirá al incorporar datos reales.
- Aprobado el 2026-10-13: ilustraciones sintéticas identificadas como demostración en
  /evidencia/demo/ del frontend; API Core entrega rutas/recuadros y no material restringido.
- El repo existente es una base revisable: corregir/pulir lo necesario, sin tratar sus
  decisiones o reglas como fuente absoluta de verdad.
- Vigentes salvo revisión: React 19/Vite 6/TypeScript, TanStack Query, estrategia DOM, proxy
  local y espera frontend de diez segundos. Versiones y comandos siguen sujetos a revisión.
- Contrato v1 documentado y referenciado por ambos repos. Pendientes: recursos concretos de evidencia, configuración
  concreta de CI por repo y orden de adaptación. No añadir polling automáticamente.

Esta revisión completa precede al nuevo plan y tareas/issues. Specs 002/004 conservan su
verificación de equipos y salud; documentar sus ampliaciones de eventos contra esta revisión
antes de implementar. Registrar repos separados y consecuencias de CI/topología mediante ADR
aprobado. Este documento no autoriza instalaciones, implementación ni cambios de infraestructura.
