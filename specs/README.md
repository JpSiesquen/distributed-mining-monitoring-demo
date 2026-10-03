# Specs

Cada funcionalidad o entregable relevante se especifica antes de implementarse.

| Spec | Entregable | Estado |
|------|------------|--------|
| [001](001-topologia-despliegue/spec.md) | Topología de despliegue | Aprobada |
| [002](002-api-core-minimo/spec.md) | API Core mínimo con equipos simulados | En revisión (logs/pruebas) |
| [003](003-ci-minima/spec.md) | CI mínima de compilación y pruebas | En revisión |

## Flujo

1. **`spec.md`** — qué se construye y por qué. Sin decisiones técnicas.
2. **`plan.md`** — cómo se construye. Enlaza a los ADR relacionados.
3. **`tasks.md`** — tareas pequeñas, ordenadas y verificables.
4. **Implementación** — tarea por tarea, validando contra los criterios de aceptación.

Una spec se considera cerrada cuando todos sus criterios de aceptación se cumplen y están
verificados. Si la implementación cambia el alcance, se actualiza la spec en el mismo cambio.

No se crean specs para cambios triviales.

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
