# Spec 002 — API Core mínimo con equipos simulados

- **Estado:** Aprobada
- **Revisión:** incorporación de logs y pruebas básicas; decisiones técnicas previas conservadas.
- **Fecha:** 2026-10-02
- **Fecha de aprobación de la revisión:** 2026-10-03

## Contexto

El BFF necesita una API que responda solicitudes de equipos antes de integrar SQL Server.
Un conjunto de datos simulados permite construir y verificar ese flujo sin depender todavía
de una base de datos, manteniendo la separación de capas del ADR 0001.

## Objetivo

Ejecutar localmente un API Core que permita comprobar que el servicio responde y consultar
un listado de equipos simulados en JSON, tanto en desarrollo como desde su compilación.

## Alcance

- **Incluye:** servicio HTTP, comprobación de disponibilidad, listado de equipos desde datos
  mock JSON, configuración externa, respuestas básicas de error, logs mínimos, pruebas
  automatizadas y ejecución compilada.
- **No incluye:** SQL Server ni driver, BFF, frontend, edición de equipos, autenticación,
  contenedores, proxy, despliegue cloud, CI/CD ni funcionalidades de visualización.

El stack final se mantiene en Node.js, Express 4, TypeScript 5.x y ES Modules con npm.
Express 4.22.3 aprobado el 2026-10-03 como actualización de mantenimiento por
[revisión de dependencias](../../docs/seguridad-dependencias.md); instalación pendiente de autorización.
Los mocks son temporales para este listado; no sustituyen la integración SQL Server prevista.

## Requisitos

- **R1:** `GET /health` devuelve HTTP 200 y JSON que indica que el servicio responde.
  No certifica disponibilidad de SQL Server ni del sistema completo.
- **R2:** `GET /api/equipment` devuelve HTTP 200 y un listado JSON de equipos simulados.
  Cada equipo incluye únicamente un identificador y un nombre; no se incluye estado en este alcance.
- **R3:** los datos proceden de un archivo JSON local sin información real ni credenciales;
  el servicio puede ejecutarse sin base de datos.
- **R4:** interfaz de escucha y puerto se configuran externamente; el puerto acordado para
  API Core es 3002 y la ejecución local usa loopback. Documentar las variables en `.env.example`.
- **R5:** una ruta inexistente devuelve HTTP 404 en JSON; un error interno devuelve HTTP 500
  en JSON sin exponer detalles internos o información sensible.
- **R6:** existen modos de desarrollo y producción; producción ejecuta JavaScript compilado
  desde `dist/`, con comandos `dev`, `build` y `start` documentados.

- **R7:** registrar inicio, fallo de arranque y errores internos con información suficiente para
  identificar el tipo de fallo, sin volcar variables de entorno, credenciales ni datos sensibles.
- **R8:** automatizar comprobaciones del contrato de /health y /api/equipment y respuestas
  404/500, usando datos ficticios; las pruebas deben terminar sin dejar procesos o archivos alterados.

La CI mínima se especifica por separado en [003](../003-ci-minima/spec.md); no incluye despliegues.

## Criterios de aceptación

- [ ] **CA1:** una petición GET a `/health` devuelve HTTP 200 y JSON de disponibilidad del servicio.
- [ ] **CA2:** GET a `/api/equipment` devuelve HTTP 200, JSON y los equipos del archivo mock,
  con identificador y nombre para cada equipo.
- [ ] **CA3:** CA1/CA2 funcionan sin SQL Server ni credenciales de base de datos.
- [ ] **CA4:** cambiar el puerto por configuración mueve la escucha al nuevo puerto sin editar
  código; `.env.example` describe las variables y la interfaz local es loopback.
- [ ] **CA5:** una ruta inexistente devuelve 404 JSON; provocar un error interno controlado
  devuelve 500 JSON sin detalles internos ni secretos.
- [ ] **CA6:** CA1/CA2 pasan en desarrollo y después de `npm run build` seguido de `npm start`,
  que ejecuta el JavaScript generado en `dist/`.

- [ ] **CA7:** ante arranque correcto, puerto ocupado y fallo controlado del mock, los logs
  permiten distinguir los eventos sin incluir credenciales, contenido del mock ni detalles sensibles.
- [ ] **CA8:** después de build, npm test verifica 200/contrato JSON y los casos 404/500; una
  respuesta incorrecta hace fallar la prueba y termina con código no cero. Las pruebas restauran
  sus datos y cierran el servidor, sin requerir SQL Server ni servicios cloud.

## Preguntas abiertas

- **P1 — Resuelta:** el listado incluye únicamente identificador y nombre del equipo.
- **P2 — Resuelta:** comenzar directamente con Express, sin paso previo usando HTTP nativo.
- **P3 — Resuelta:** dev compila TypeScript y arranca el JavaScript generado con Node.js.
  Tras cambiar código, detener y ejecutar dev de nuevo; cualquier instalación requiere aprobación.
