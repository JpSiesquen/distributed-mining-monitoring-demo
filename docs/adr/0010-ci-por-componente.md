# ADR 0010 — CI por componente

- **Estado:** Aceptada para API Core/BFF, implementados; ampliación frontend sustituida por [ADR 0012](0012-repositorios-separados-y-contrato-eventos.md).
- **Fecha:** 2026-10-13

## Contexto

El BFF incorpora un segundo componente Node.js. La CI debe comprobarlo sin perder
la validación ni la protección de integración de API Core establecidas en ADR 0009.

## Decisión

Ampliar el workflow existente con jobs separados `api-core` y `bff`, ambos obligatorios
para integrar en main. Conservar controles, permisos mínimos y revisión de dependencias.
Validar el nuevo job antes de exigir su check en el ruleset; incorporar pruebas al existir.

Ampliación aprobada el 2026-10-13 para fase 4: añadir job frontend con build y pruebas
al existir el componente. Exigir api-core, bff y frontend tras validar sus ejecuciones;
mantener revisión de dependencias, permisos mínimos y límite de cinco minutos por job.

Revisión de alcance aprobada el 2026-10-13: frontend en repositorio separado, según revisión 2
de spec 005. [ADR 0012](0012-repositorios-separados-y-contrato-eventos.md) sustituye la ampliación
frontend anterior: check propio en su repo tras validación. Los checks api-core/bff existentes
siguen vigentes; no añadir un tercer check aquí por esta integración.

## Alternativas consideradas

Añadir pasos BFF al job api-core reduce configuración, pero mezcla ejecución y diagnóstico
de dos componentes. Un workflow adicional no aporta una necesidad actual.

## Consecuencias

Los fallos se identifican por componente; todos los checks habilitados deben pasar. Los jobs consumen
tiempo de runner y requieren revisar el uso disponible antes de habilitarlos.
Un resultado verde acredita comprobaciones, no despliegue ni ausencia de malware.
Este ADR amplía el alcance de ADR 0009; no modifica su decisión para API Core.

Referencias: [plan 004](../../specs/004-bff-minimo/plan.md) y
[plan 005](../../specs/005-frontend-minimo/plan.md).
