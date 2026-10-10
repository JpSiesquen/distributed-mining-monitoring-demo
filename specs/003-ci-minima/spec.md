# Spec 003 — CI mínima de compilación y pruebas

- **Estado:** Aprobada; ampliación R5/CA6 aprobada el 2026-10-09
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
  Los scripts de instalación de dependencias quedan desactivados; cualquier excepción requiere revisión y aprobación.
- **R5:** main solo recibe cambios mediante pull request con el check de CI exitoso; sin push
  directo, force push ni eliminación de la rama. Un check fallido bloquea la integración.

## Criterios de aceptación

- [ ] **CA1:** un cambio válido de API Core obtiene un check exitoso de build; al completar las
  pruebas de 002, también pasan en ese mismo workflow.
- [ ] **CA2:** un error TypeScript controlado hace fallar el check de compilación.
- [ ] **CA3:** una prueba de contrato fallida hace fallar el job una vez añadidas las pruebas.
- [ ] **CA4:** pushes y pull requests ejecutan las comprobaciones acordadas; logs permiten
  identificar el paso que falló, sin secretos ni conexiones de despliegue.
- [ ] **CA5:** la configuración solo comprueba componentes existentes; acciones y comandos
  de instalación tienen aprobación antes de habilitarse y no ejecutan scripts de dependencias automáticamente.
- [ ] **CA6:** un pull request con el check fallido no puede integrarse, un push directo a main
  es rechazado y un pull request con el check exitoso se integra normalmente.

## Preguntas abiertas

- **P1 resuelta en diseño:** disparadores, runner, versiones y permisos definidos en el
  [plan aprobado](plan.md). Antes de habilitar, completar su revisión de dependencias,
  seguridad y condiciones vigentes. Workflow creado y verificado en T02–T03.
- **P2 (2026-10-09):** la verificación de T03 mostró que un pull request en rojo seguía siendo
  integrable. R5/CA6 convierten el check en obligatorio; diseño en el [plan](plan.md).

Referencia: [compilación y pruebas Node.js en GitHub Actions](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).
