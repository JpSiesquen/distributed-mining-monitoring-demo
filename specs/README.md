# Specs

El proyecto sigue desarrollo guiado por especificaciones (Spec-Driven Development, SDD).
Cada funcionalidad o entregable relevante se especifica antes de implementarse.
Los números de spec y de fase son independientes; la secuencia de fases se mantiene en
el [roadmap técnico](../docs/roadmap.md#fases-y-entregables).

La tabla está ordenada por fase de ejecución. Cada carpeta dispone de `spec.md`, `plan.md`
y `tasks.md`; las reservas vacías permiten ver la ruta y no aprueban alcance ni implementación.

| Fase | Carpeta / spec | Entregable | Estado |
|------|----------------|------------|--------|
| 1–2 | [002-api-core-minimo](002-api-core-minimo/spec.md) | API Core con datos mock | Implementada y verificada |
| 1–2 | [003-ci-minima](003-ci-minima/spec.md) | CI de compilación y pruebas | Implementada y verificada |
| 3 | [004-bff-minimo](004-bff-minimo/spec.md) | BFF consumiendo API Core | Implementado; T01–T09 y CA1–CA8 verificados. Cierre documental integrado en PR #91. |
| 4 | [005-frontend-minimo](005-frontend-minimo/spec.md) | Mining Ops Console consumiendo BFF | Spec revisión 2, plan y T01–T15 aprobados. T01–T05 completadas; T06/#95 en validación. [Tareas e issues](005-frontend-minimo/tasks.md#issues-de-ejecución) en ambos repos; integración de la consola pendiente. |
| 5 | [006-integracion-sql-server](006-integracion-sql-server/spec.md) | Integración SQL Server | Reservada; documentos vacíos |
| 6 | [007-docker-nginx](007-docker-nginx/spec.md) | Empaquetado y entrada HTTP | Reservada; documentos vacíos |
| 7 | [001-topologia-despliegue](001-topologia-despliegue/spec.md) | Despliegue DEV/QA | Diseño aprobado; implementación pendiente |
| 8 | [008-promocion-artefactos-cd](008-promocion-artefactos-cd/spec.md) | Promoción de artefactos y CD | Reservada; documentos vacíos |
| 9 (condicional) | [009-ampliaciones](009-ampliaciones/spec.md) | Ampliaciones justificadas | Reservada; definir solo ante requisitos concretos |

## Flujo

1. **`spec.md`** — qué se construye y por qué. Sin decisiones técnicas.
2. **`plan.md`** — cómo se construye. Enlaza a los ADR relacionados.
3. **`tasks.md`** — tareas pequeñas, ordenadas y verificables.
4. **Implementación** — tarea por tarea, validando contra los criterios de aceptación.

Una spec se considera cerrada cuando todos sus criterios de aceptación se cumplen y están
verificados. Si la implementación cambia el alcance, se actualiza la spec en el mismo cambio.

## Revisar decisiones y documentos

Una aprobación corresponde a la versión revisada; los documentos pueden evolucionar.
Si cambia el resultado esperado, revisar la spec; si cambia la solución, el plan; si cambian
los pasos, las tareas. Evaluar el impacto en código y pruebas y validar los cambios relevantes
antes de implementarlos. Mantener documentación e implementación coherentes en el mismo cambio.
Una decisión de arquitectura sustituida se registra en un nuevo ADR, enlazado desde el anterior.

No se crean specs para cambios triviales; el detalle documental debe ser proporcional al cambio.

## Seguimiento en GitHub

Las issues concretan tareas aprobadas: contexto breve, acciones, aceptación verificable y
referencia a la spec. Las dependencias directas se enlazan por número; no se confunden con cierre.
Un milestone agrupa cada entrega; el backlog permanece sin asignar hasta iniciar trabajo.
Una issue por PR, con comprobaciones antes de integrar y `Closes #N` para su cierre.

| Área | Alcance |
|------|---------|
| `area:backend` | BFF, API Core, rutas, contratos y lógica de servidor |
| `area:frontend` | Interfaz y comunicación del cliente con BFF |
| `area:datos` | Datos simulados, SQL Server, consultas y persistencia |
| `area:infra` | Compilación, CI, ejecución, redes y despliegue |
| `area:seguridad` | Permisos, secretos, aislamiento y revisión de dependencias |
| `area:docs` | Especificaciones, ADR, instrucciones y evidencias |

Tipo y prioridad son únicos por issue. La dificultad expresa riesgo de error, no volumen.

## Plantilla de `spec.md`

```markdown
# Spec NNN — Título

- **Estado:** Borrador | En revisión | Aprobada | Implementada
- **Fecha:** AAAA-MM-DD

## Contexto
Problema o necesidad que motiva el cambio.

## Objetivo
Qué debe ser posible cuando esté terminado.

## Alcance
- Incluye: ...
- No incluye: ...

## Requisitos
- R1: ...

## Criterios de aceptación
- [ ] CA1: condición verificable (comando, URL o resultado esperado).

## Preguntas abiertas
- ...
```

## Plantilla de `plan.md`

```markdown
# Plan NNN — Título

- **Spec:** [NNN](spec.md)
- **Estado:** Borrador | En revisión | Aprobado

## Enfoque
Resumen de la solución técnica en pocas líneas.

## Diseño
Componentes, configuración y diagramas necesarios para cumplir los requisitos.

## Decisiones
- Decisión, alternativa descartada y motivo. Las relevantes se registran como ADR.

## Respuesta a preguntas abiertas
- P1: ...

## Trazabilidad
| Requisito | Cómo se cumple |
|-----------|----------------|
| R1 | ... |

## Riesgos
- Riesgo y mitigación.
```
