# Roadmap técnico

Actualizado: 2026-10-09.

## Objetivo

Monitoreo de maquinaria minera mediante Frontend → BFF → API Core → SQL Server,
con DEV consolidado y QA distribuido según la topología aprobada.

## Punto actual y próxima acción

Diseño de topología aprobado ([001](../specs/001-topologia-despliegue/plan.md)); validación práctica pendiente.
Spec, plan y tareas de [API Core](../specs/002-api-core-minimo/tasks.md) y
[CI mínima](../specs/003-ci-minima/tasks.md) aprobados. Arranque, logs y comandos build/start/dev
de API Core integrados (002/T03–T04); rutas HTTP y workflow pendientes.

**Siguiente:** revisión previa de GitHub Actions (003/T01, issue #4) y después el workflow de
compilación (003/T02, issue #7, que concreta 002/T05), antes de añadir rutas.
Revisión de dependencias integrada en PR #32; las cuatro versiones están aprobadas.
Instalación local realizada y lockfile contrastado. Consultar el
[backlog de GitHub](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/issues),
respetando sus dependencias.

**Prerrequisito de seguridad:** revisar [Shai-Hulud y malware en dependencias](seguridad-dependencias.md)
antes de instalar o ejecutar Actions ([política](../AGENTS.md#política-de-dependencias-y-ejecución);
[002/T01](../specs/002-api-core-minimo/tasks.md) y [003/T01](../specs/003-ci-minima/tasks.md)).
Revisión preliminar registrada y alertas de Dependabot activadas; contrastar el grafo definitivo
con el lockfile. Lockfile y CI no sustituyen esta comprobación.

## Ruta de entregables

| Orden | Entregable | Estado / dependencia |
|-------|------------|----------------------|
| 1 | API Core con equipos mock y CI de build/pruebas | Definido en 002/003; ejecución pendiente. |
| 2 | BFF consumiendo API Core | Por especificar; requiere API Core verificable. |
| 3 | Frontend consumiendo únicamente BFF | Por especificar; completar flujo local con mocks. |
| 4 | Integración SQL Server y persistencia | Por especificar; mantener contrato entre capas. |
| 5 | Empaquetado con Docker y entrada Nginx | Concretar ejecución y verificar flujo completo local antes de desplegar. |
| 6 | Despliegue y validación DEV/QA | Ejecutar 001: Linux, Azure, red, acceso, aislamiento y recuperación; validar costos antes de aprovisionar. |
| 7 | Promoción de artefactos y CD | Por especificar después del despliegue verificable. |
| 8 | Ampliaciones de seguridad, observabilidad y UI/3D | Concretar solo ante requisitos demostrados. |

Logs, pruebas, configuración y seguridad acompañan cada entrega. Ampliar CI cuando exista
cada componente; no posponerla al despliegue. Resolver dependencias de ejecución antes de empaquetar.

## Cómo continuar

Planificar en detalle el trabajo próximo; mantener el futuro a nivel de entregables.
Este roadmap orienta, no aprueba alcances nuevos. Consultar [specs](../specs/README.md) y
[ADR](adr/README.md) pertinentes; cerrar tareas y criterios solo con evidencia verificable.
