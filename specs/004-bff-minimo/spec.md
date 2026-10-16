# Spec 004 — BFF mínimo para consulta de equipos

- **Estado:** Implementada y verificada el 2026-10-13; CA1–CA8 acreditados en [operación](../../bff/README.md#evidencia-de-aceptación).
- **Fecha:** 2026-10-13

## Contexto

API Core ofrece salud y equipos simulados con contratos HTTP verificados. El frontend
previsto debe consumir únicamente el BFF, que consulta API Core según la arquitectura
aprobada. Antes de implementar el frontend, hace falta verificar ese intermediario.

## Objetivo

Consultar los equipos a través del BFF y distinguir su disponibilidad de los fallos
de API Core, con configuración externa, errores seguros y pruebas verificables.

## Alcance

- Incluye: disponibilidad del BFF, consulta de equipos mediante API Core, espera limitada,
  errores JSON, configuración externa, logs mínimos, ejecución compilada, pruebas y CI.
- No incluye: frontend, acceso SQL, mock propio de operación, escritura de equipos,
  autenticación, agregaciones, caché, reintentos automáticos, contenedores o despliegue.

Se conserva el stack Node.js, Express 4, TypeScript y ES Modules. Versiones exactas,
comandos y cambios de CI se revisarán en el plan antes de cualquier instalación o ejecución.

## Requisitos

- **R1:** el BFF consulta únicamente API Core; no accede a SQL ni lee el mock de API Core
  desde el sistema de archivos. El frontend previsto no puede saltarse el BFF.
- **R2:** GET /health devuelve 200 JSON con status ok cuando el BFF responde, independiente
  de la disponibilidad de API Core. No acredita el flujo completo.
- **R3:** GET /api/equipment consulta la ruta correspondiente de API Core y devuelve 200
  con el mismo arreglo id/name, sin campos o envoltorios nuevos.
- **R4:** una ruta inexistente devuelve 404 JSON. Si API Core no es accesible, falla o
  entrega una respuesta inválida, la consulta devuelve 502 con un error JSON genérico sin
  secretos ni detalles internos. Si supera el límite de espera, devuelve 504 JSON genérico;
  no se mantiene una petición indefinidamente.
- **R5:** dirección de API Core, interfaz, puerto y límite de espera se configuran externamente
  y se documentan sin valores sensibles en .env.example. Configuración inválida o puerto
  ocupado impiden el arranque; no hay cambio silencioso de destino o puerto.
- **R6:** build comprueba tipos y genera JavaScript; start ejecuta la salida compilada;
  dev compila y solo después de un build correcto arranca. Sin recarga automática inicial.
- **R7:** logs distinguen arranque, fallo de configuración/escucha y fallo de consulta a
  API Core, sin registrar credenciales, cuerpos de respuesta o el entorno completo.
- **R8:** pruebas automatizadas verifican los contratos y fallos del BFF con una fuente HTTP
  controlada. CI comprueba build/pruebas del BFF y conserva las comprobaciones de API Core;
  sus fallos impiden integrar. No requiere SQL, frontend ni servidores del cliente.

## Criterios de aceptación

- [x] **CA1:** /health devuelve 200 y JSON status ok aunque API Core esté detenido.
- [x] **CA2:** con API Core disponible, /api/equipment devuelve su arreglo id/name a través
  de HTTP; el BFF no lee archivos ni usa credenciales SQL.
- [x] **CA3:** API Core detenido, respuesta no exitosa o JSON/contrato inválido producen
  502 JSON genérico; demora superior al límite produce 504 JSON genérico.
  /health del BFF sigue disponible.
- [x] **CA4:** ruta desconocida devuelve 404 JSON; respuestas y logs de fallo no exponen
  configuración sensible ni detalles de la respuesta interna.
- [x] **CA5:** cambiar el destino de API Core o el puerto por configuración y reiniciar
  modifica la comunicación sin editar código. Valores inválidos y puerto ocupado fallan claramente.
- [x] **CA6:** CA1/CA2 funcionan en dev y después de build/start; un error de tipos impide
  arrancar con una compilación anterior.
- [x] **CA7:** pruebas terminan con salida no cero ante una expectativa incorrecta y limpian
  procesos/recursos temporales. Funcionan sin SQL, frontend ni credenciales de despliegue.
- [x] **CA8:** CI conserva el check de API Core, ejecuta build/pruebas de BFF y bloquea
  integración ante fallo. Las Actions, comandos y protección aplicables se validan antes de habilitarlos.

## Preguntas abiertas

Ampliación posterior aprobada en [005](../005-frontend-minimo/spec.md): GET /api/events vía
API Core según [eventos v1](../../docs/contratos/eventos-v1.md), implementada en #95 y en validación antes de integrar.
Equipos/health, sus contratos y CA1–CA8 siguen vigentes. Documentar esta ampliación no acredita
las rutas nuevas ni cambia la aplicación frontend publicada.

- **P1 — Resuelta (2026-10-13):** conservar /api/equipment y el mismo arreglo id/name de
  API Core. No añadir envoltorios, total ni campos nuevos sin un requisito concreto del frontend.
  Al especificar la fase 4, contrastar sus necesidades con este contrato; si requiere cambios,
  revisar la spec y los contratos/pruebas afectados antes de implementarlos.
- **P2 — Resuelta (2026-10-13):** 502 para API Core inaccesible, respuesta no exitosa o
  inválida; 504 para espera agotada. Mensajes JSON genéricos; decisión aprobada por el responsable.
- **P3 — Resuelta (2026-10-13):** espera configurable inicial de cinco segundos y jobs
  api-core/bff separados, ambos checks obligatorios; configuración y plan completos aprobados.

Esta spec corresponde a la fase 3. No completa 001/T02: todavía falta el frontend.
