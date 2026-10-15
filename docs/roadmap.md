# Roadmap técnico

Actualizado: 2026-10-15.

## Objetivo

Monitoreo de maquinaria minera mediante Frontend → BFF → API Core → SQL Server,
con DEV consolidado y QA distribuido según la topología aprobada.

## Punto actual y próxima acción

Diseño de topología aprobado ([001](../specs/001-topologia-despliegue/plan.md)); validación práctica pendiente.
Spec, plan y tareas de [API Core](../specs/002-api-core-minimo/tasks.md) y
[CI mínima](../specs/003-ci-minima/tasks.md) aprobados. Arranque, logs y comandos build/start/dev
de API Core integrados (002/T03–T04); workflow de compilación creado (003/T02); GET /health, GET /api/equipment con datos simulados y errores 404/500 en JSON integrados
(002/T06–T08); pruebas de contratos con `npm test` (002/T09), ejecutadas en CI (003/T04).

**Próxima entrega:** [T02](../specs/005-frontend-minimo/tasks.md), revisión de dependencias
en [frontend #37](https://github.com/JpSiesquen/mining-ops-console/issues/37), sin nuevas instalaciones.
T01/CA1 completadas: [backend #93](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues/93)
y [frontend #36](https://github.com/JpSiesquen/mining-ops-console/issues/36) integradas.
[Contrato eventos v1](contratos/eventos-v1.md) y [ADR 0012](adr/0012-repositorios-separados-y-contrato-eventos.md)
integrados en backend 3de8694 y referenciados desde frontend
[PR #50](https://github.com/JpSiesquen/mining-ops-console/pull/50), merge 15afc15a.
Vercel READY y alias de producción contrastados con ese merge. Esto acredita publicación
documental; endpoints de eventos, validadores y pantallas integradas siguen pendientes.
La corrección transitiva de seguridad [frontend #49](https://github.com/JpSiesquen/mining-ops-console/pull/49)
está integrada, con build local y despliegue verificados; no completa la selección de T02.
El frontend publicado se preserva: antes de publicar cambios en su repo, verificar versión
servida y desencadenantes de preview/producción; no asumir que un PR carece de efectos externos.
Spec 005 revisión 2 aprobada: Mining Ops Console en su propio repo, lectura primero y
Material UI; atención persistente después. GET /api/events con arreglo directo y UTC ficticia
aprobados, junto con evidencia sintética de demostración. Spec, plan y T01–T15 aprobados;
T01 completada, T02 en revisión y T03–T15 pendientes. PR #92 integrado; cinco issues backend y trece frontend publicadas con
dependencias entre repos. [Mapa de tareas/issues](../specs/005-frontend-minimo/tasks.md#issues-de-ejecución).
Corrección editorial frontend integrada en PR #35; no acredita migración ni contrato implementado.
Instalaciones y ejecución de la migración siguen sujetas a las autorizaciones aplicables.
Revisión #59 integrada; base compilable, instalación autorizada y lockfile definitivo de 82 paquetes
verificados en #60. Arranque, entorno y comandos start/dev verificados en #62;
GET /health integrado en #63. Consulta de equipos vía API Core, 404/502/504 y logs seguros
integrados en #64. Suite de once pruebas HTTP integrada en #65; ejecución y fallos en CI
verificados en #66 e integrados en PR #89.
[estado](../bff/README.md).
El backlog original #70–#79 quedó cerrado como sustituido, con enlaces y fuera del milestone activo.
Los milestones Fase 4 contienen [cinco issues backend](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/milestone/5)
y [trece frontend](https://github.com/JpSiesquen/mining-ops-console/milestone/1). No crear frontend duplicado aquí.
La fase 3 tiene
[issues #59–#67](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/milestone/4)
publicadas desde las [tareas 004](../specs/004-bff-minimo/tasks.md).
Spec BFF implementada; T01–T09 y CA1–CA8 verificados, con [matriz operativa](../bff/README.md#evidencia-de-aceptación).
Ruleset exige api-core/bff; casos negativos restaurados sin integrar. Cierre documental #67
integrado en PR #91; issue cerrada. 001/T02 sigue pendiente hasta verificar su flujo completo.
La [estructura de specs](../specs/README.md)
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
| 3 | BFF consumiendo API Core | Implementado y verificado: 004/T01–T09, CA1–CA8. Cierre #67 integrado en PR #91; milestone aún abierto. |
| 4 | Mining Ops Console consumiendo únicamente BFF | T01/CA1 completadas; T02 en revisión. Contrato documentado en ambos repos; integración HTTP pendiente. Conservar contrato id/name existente. |
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
