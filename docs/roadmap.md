# Roadmap técnico

Actualizado: 2026-10-13.

## Objetivo

Monitoreo de maquinaria minera mediante Frontend → BFF → API Core → SQL Server,
con DEV consolidado y QA distribuido según la topología aprobada.

## Punto actual y próxima acción

Diseño de topología aprobado ([001](../specs/001-topologia-despliegue/plan.md)); validación práctica pendiente.
Spec, plan y tareas de [API Core](../specs/002-api-core-minimo/tasks.md) y
[CI mínima](../specs/003-ci-minima/tasks.md) aprobados. Arranque, logs y comandos build/start/dev
de API Core integrados (002/T03–T04); workflow de compilación creado (003/T02); GET /health, GET /api/equipment con datos simulados y errores 404/500 en JSON integrados
(002/T06–T08); pruebas de contratos con `npm test` (002/T09), ejecutadas en CI (003/T04).

**Siguiente entrega ejecutable:** añadir salud independiente del BFF
([#63](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/63)) después de integrar #62.
Revisión #59 integrada; base compilable, instalación autorizada y lockfile definitivo de 82 paquetes
verificados en #60. Arranque, entorno y comandos start/dev verificados en #62;
rutas HTTP BFF pendientes; [estado](../bff/README.md).
La planificación 005 está aprobada e integrada en PR #69; sus diez
[issues #70–#79](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/milestone/5)
están publicadas desde las [tareas 005](../specs/005-frontend-minimo/tasks.md), sin implementación.
La fase 3 tiene
[issues #59–#67](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/milestone/4)
publicadas desde las [tareas 004](../specs/004-bff-minimo/tasks.md).
Spec, plan y tareas del BFF aprobados; T01–T04 verificados. CI integrada en PR #83;
ruleset exige api-core/bff. #62 pendiente de integración. Planificar frontend no
completa el BFF ni elimina esa dependencia. La [estructura de specs](../specs/README.md)
incluye las reservas documentales de las fases restantes, ordenadas por ejecución.
API Core mock implementado y CA1–CA8 verificados: [operación](../api-core/README.md).
CI implementada (spec 003); CA1–CA8 contrastados y enlazados en [CI de API Core](ci.md).
Evidencia de fallos integrada en PR #55.
Endurecimiento integrado en PR #52:
límite de 5 minutos y control de `.npmrc` antes de instalar. Build, disparadores y protección de
main verificados (003/T03 y T08): main solo acepta pull requests con el check de CI exitoso.
Revisión de dependencias integrada en PR #32; las cuatro versiones están aprobadas.
Instalación local realizada y lockfile contrastado. Consultar el
[backlog de GitHub](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues),
respetando sus dependencias.

**Prerrequisito de seguridad:** revisar [Shai-Hulud y malware en dependencias](seguridad-dependencias.md)
antes de instalar o ejecutar Actions ([política](../AGENTS.md#política-de-dependencias-y-ejecución);
[002/T01](../specs/002-api-core-minimo/tasks.md) y [003/T01](../specs/003-ci-minima/tasks.md)).
Revisión preliminar registrada y alertas de Dependabot activadas; contrastar el grafo definitivo
con el lockfile. Lockfile y CI no sustituyen esta comprobación.

## Fases y entregables

| Fase | Entregable | Estado / dependencia |
|-------|------------|----------------------|
| 1 | API Core compilable con CI obligatoria | Completada; milestone cerrado. |
| 2 | Rutas, errores y pruebas de API Core | Completada y documentada: CA1–CA8 de 002 y 003; milestone cerrado. |
| 3 | BFF consumiendo API Core | Base compilable y CI integradas; arranque verificado (004/T04), #62 pendiente de integración. Rutas pendientes. |
| 4 | Dashboard consumiendo únicamente BFF | Spec, plan y tareas 005 aprobados; diez issues publicadas, implementación pendiente. Industrial oscuro/ámbar, tarjetas, búsqueda, contador y estados visuales. Conserva [contrato 004/P1](../specs/004-bff-minimo/spec.md#preguntas-abiertas); integración requiere BFF implementado. |
| 5 | Integración SQL Server y persistencia | Por especificar; mantener contrato entre capas. |
| 6 | Empaquetado con Docker y entrada Nginx | Concretar ejecución y verificar flujo completo local antes de desplegar. |
| 7 | Despliegue y validación DEV/QA | Milestone de topología renumerado; ejecutar 001 y verificar sus prerrequisitos. Validar costos antes de aprovisionar. |
| 8 | Promoción de artefactos y CD | Por especificar después del despliegue verificable. |
| 9 (condicional) | Ampliaciones de seguridad, observabilidad y UI/3D | Concretar solo ante requisitos demostrados. |

La numeración identifica fases de entrega, no specs. El milestone de topología pasó de
Fase 3 a Fase 7 y sus prefijos de issues de 3-N a 7-N; conserva IDs, enlaces y dependencias.
Los milestones/issues de las fases futuras se concretarán al aprobar sus specs.
Las carpetas y archivos vacíos de specs son reservas de estructura; se completan al abordar cada fase.

Logs, pruebas, configuración y seguridad acompañan cada entrega. Ampliar CI cuando exista
cada componente; no posponerla al despliegue. Resolver dependencias de ejecución antes de empaquetar.

## Cómo continuar

Planificar en detalle el trabajo próximo; mantener el futuro a nivel de entregables.
Este roadmap orienta, no aprueba alcances nuevos. Consultar [specs](../specs/README.md) y
[ADR](adr/README.md) pertinentes; cerrar tareas y criterios solo con evidencia verificable.
