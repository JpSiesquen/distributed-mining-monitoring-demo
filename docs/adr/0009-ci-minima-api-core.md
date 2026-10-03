# ADR 0009 — CI mínima de API Core

- **Estado:** Aceptada
- **Fecha:** 2026-10-03

## Contexto

API Core necesita comprobar compilación y contratos antes de integrar cambios.
La spec y el plan 003 definen comprobaciones progresivas sobre componentes existentes.

## Decisión

- Usar GitHub Actions con un solo job de API Core en push y pull_request hacia main.
- Ejecutar en runner estándar hospedado por GitHub, Ubuntu 22.04 x64.
- Usar la misma versión exacta de Node.js en desarrollo y CI; selección inicial 24.21.0.
- Obtener código y preparar Node.js con acciones oficiales fijadas a los SHA revisados
  del plan 003. Actualizar versiones mediante cambios explícitos y revisados.
- Conceder contents: read y desactivar persistencia de credenciales y caché inicial de npm.
- Instalar desde lockfile aprobado, compilar y añadir pruebas al existir, en el mismo job.
- Hacer fallar el job ante errores de instalación, compilación o pruebas; conservar logs.
- Revisar dependencias, seguridad, compatibilidad y costos antes de habilitar la ejecución.

## Alternativas consideradas

- **Runner propio:** añade mantenimiento y acceso a infraestructura sin necesidad actual.
- **Matriz de plataformas/versiones:** amplía comprobaciones y configuración sin requisito actual.
- **Versiones flotantes y permisos de escritura:** permiten cambios o capacidades innecesarios
  para el objetivo de compilar y probar.

## Consecuencias

- Un check exitoso acredita las comprobaciones ejecutadas, no despliegue ni acceso a SQL.
- Las pruebas se incorporan al mismo flujo; no cerrar 003 hasta verificarlas.
- La aprobación del diseño no equivale a implementación ni autoriza instalaciones por sí sola.
- Mantener versiones y acciones requiere revisión explícita cuando se actualicen.

Referencia: [plan 003](../../specs/003-ci-minima/plan.md).
