# ADR 0010 — CI por componente

- **Estado:** Aceptada; implementación pendiente
- **Fecha:** 2026-10-13

## Contexto

El BFF incorpora un segundo componente Node.js. La CI debe comprobarlo sin perder
la validación ni la protección de integración de API Core establecidas en ADR 0009.

## Decisión

Ampliar el workflow existente con jobs separados `api-core` y `bff`, ambos obligatorios
para integrar en main. Conservar controles, permisos mínimos y revisión de dependencias.
Validar el nuevo job antes de exigir su check en el ruleset; incorporar pruebas al existir.

## Alternativas consideradas

Añadir pasos BFF al job api-core reduce configuración, pero mezcla ejecución y diagnóstico
de dos componentes. Un workflow adicional no aporta una necesidad actual.

## Consecuencias

Los fallos se identifican por componente; ambos checks deben pasar. Dos jobs consumen
tiempo de runner y requieren revisar el uso disponible antes de habilitarlos.
Un resultado verde acredita comprobaciones, no despliegue ni ausencia de malware.
Este ADR amplía el alcance de ADR 0009; no modifica su decisión para API Core.

Referencia: [plan 004](../../specs/004-bff-minimo/plan.md).
