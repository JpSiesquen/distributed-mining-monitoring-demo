# Specs

Cada funcionalidad o entregable relevante se especifica antes de implementarse.

| Spec | Entregable | Estado |
|------|------------|--------|
| [001](001-topologia-despliegue/spec.md) | Topología de despliegue | Aprobada |

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
