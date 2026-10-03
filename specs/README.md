# Specs

El proyecto sigue desarrollo guiado por especificaciones (Spec-Driven Development, SDD).
Cada funcionalidad o entregable relevante se especifica antes de implementarse.

| Spec | Entregable | Estado |
|------|------------|--------|
| [001](001-topologia-despliegue/spec.md) | Topología de despliegue | Aprobada |
| [002](002-api-core-minimo/spec.md) | API Core mínimo con equipos simulados | Spec, plan y tareas aprobados; ejecución pendiente |
| [003](003-ci-minima/spec.md) | CI mínima de compilación y pruebas | Spec, plan y tareas aprobados; ejecución pendiente |

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
