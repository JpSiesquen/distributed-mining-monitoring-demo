# ADR 0011 — Proxy local entre frontend y BFF

- **Estado:** Aceptada; implementación pendiente
- **Fecha:** 2026-10-13

## Contexto

El dashboard necesita consultar al BFF durante desarrollo y al verificar el artefacto
estático local. La topología aprobada prevé entrada de mismo origen mediante Nginx.

## Decisión

El navegador consulta /api/equipment en su mismo origen. Vite reenvía /api al BFF en
desarrollo y preview local, con destino configurado por BFF_URL fuera del bundle.
Escuchar en 127.0.0.1, puertos 5173/4173 respectivamente, con strictPort para fallar
si están ocupados. Validar el destino sin credenciales; no modificar CORS del BFF.

## Alternativas consideradas

Consulta directa del navegador al origen BFF: requiere gestionar CORS y publicar su
destino en el cliente. Introducir Nginx ahora adelanta el alcance previsto para fase 6.

## Consecuencias

El mismo contrato de URL relativa funciona en desarrollo y comprobación local.
El proxy no forma parte de dist/ y preview no se utiliza como servidor de producción.
Nginx deberá implementar el reenvío al abordar fase 6. No se acredita despliegue con esta decisión.

Referencia: [plan 005](../../specs/005-frontend-minimo/plan.md).
