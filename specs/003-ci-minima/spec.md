# Spec 003 — CI mínima de compilación y pruebas

- **Estado:** Aprobada
- **Fecha:** 2026-10-03

## Contexto

API Core tendrá compilación TypeScript y pruebas de contrato. Ejecutarlas automáticamente
sobre cambios permite detectar fallos antes de integrar nuevas versiones. El despliegue se
mantiene separado de estas comprobaciones.

## Objetivo

Obtener un resultado visible de integración continua en GitHub para el código existente:
primero compilación y, cuando las pruebas estén disponibles, compilación y pruebas.

## Alcance

- **Incluye:** GitHub Actions, comprobación reproducible de API Core y resultado visible en
  pushes y pull requests. Ampliación posterior a BFF/frontend solo cuando existan.
- **No incluye:** despliegues, credenciales Azure/SSH, publicación de imágenes, matrices de
  múltiples plataformas/versiones, ramas obligatorias por entorno ni nuevas herramientas de pruebas.

## Requisitos

- **R1:** comprobar cambios mediante un workflow con permisos mínimos, sin secretos de despliegue.
- **R2:** instalar desde el lockfile aprobado y ejecutar build. Al disponer de npm test,
  ejecutarlo en el mismo flujo; no llamar comandos o proyectos que aún no existen.
- **R3:** cualquier fallo de instalación, compilación o pruebas produce un resultado fallido.
  El resultado correcto se muestra como check exitoso; no se presenta como evidencia de despliegue.
- **R4:** revisar acciones externas, versiones, permisos, comandos de instalación y condiciones
  de uso/costo antes de habilitar el workflow. No ampliar permisos para resolver fallos sin validación.

## Criterios de aceptación

- [ ] **CA1:** un cambio válido de API Core obtiene un check exitoso de build; al completar las
  pruebas de 002, también pasan en ese mismo workflow.
- [ ] **CA2:** un error TypeScript controlado hace fallar el check de compilación.
- [ ] **CA3:** una prueba de contrato fallida hace fallar el job una vez añadidas las pruebas.
- [ ] **CA4:** pushes y pull requests ejecutan las comprobaciones acordadas; logs permiten
  identificar el paso que falló, sin secretos ni conexiones de despliegue.
- [ ] **CA5:** la configuración solo comprueba componentes existentes; acciones y comandos
  de instalación tienen aprobación antes de habilitarse.

## Preguntas abiertas

- **P1 resuelta en diseño:** disparadores, runner, versiones y permisos definidos en el
  [plan aprobado](plan.md). Antes de habilitar, completar su revisión de dependencias,
  seguridad y condiciones vigentes. No se ha creado ningún workflow.

Referencia: [compilación y pruebas Node.js en GitHub Actions](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).
