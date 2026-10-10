# Specs

El proyecto sigue desarrollo guiado por especificaciones (Spec-Driven Development, SDD).
Cada funcionalidad o entregable relevante se especifica antes de implementarse.

| Spec | Entregable | Estado |
|------|------------|--------|
| [001](001-topologia-despliegue/spec.md) | Topología de despliegue | Aprobada |
| [002](002-api-core-minimo/spec.md) | API Core mínimo con equipos simulados | En ejecución: T01–T05 completadas; rutas pendientes |
| [003](003-ci-minima/spec.md) | CI mínima de compilación y pruebas | En ejecución: build y protección de main verificados; pruebas pendientes |

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
