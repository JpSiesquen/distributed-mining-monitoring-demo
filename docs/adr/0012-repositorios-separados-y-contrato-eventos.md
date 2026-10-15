# ADR 0012 — Repositorios separados y contrato de eventos

- **Estado:** Aceptada en el plan 005 el 2026-10-13; registro del 2026-10-15.
- **Alcance:** sustituye la ampliación frontend de ADR 0010; mantiene sus decisiones backend.
- **Implementación:** pendiente. Este registro no cambia workflows, rulesets ni despliegues.

## Contexto

Mining Ops Console ya existe en otro repositorio y tiene una versión publicada que debe
preservarse durante la integración. La planificación inicial creaba un frontend nuevo
junto a API Core/BFF y exigía tres checks en el mismo repo. El plan 005 aprobado reutiliza
la consola, añade lectura de eventos y mantiene equipos/health existentes.

## Decisión

- `mining-ops-console` conserva el frontend. `distributed-mining-monitoring-demo` mantiene
  API Core, BFF, contrato canónico e infraestructura. No duplicar la aplicación.
- El navegador obtiene datos solo mediante BFF; API Core es la autoridad de eventos.
  [Eventos v1](../contratos/eventos-v1.md) define el acuerdo, referenciado por commit desde frontend.
- Primera entrega de lectura con datos ficticios, UTC e ilustraciones sintéticas. Adaptar
  pantallas a Material UI; atención persistente requiere otra entrega aprobada.
- CI del frontend pertenece a su repo y tendrá su propio check tras revisión y validación.
  Backend conserva api-core/bff. No exigir aquí un check generado únicamente en el otro repo.
- Proveedor compatible antes que consumidor; validar también la pareja real de SHA. No
  añadir dispatch, credenciales compartidas ni checkout privado desde la CI pública.

El proxy local de ADR 0011 mantiene mismo origen, puertos y configuración aprobados;
incluye /api/events al implementar la lectura. No habilitar CORS abierto ni desplegar Nginx
como parte de esta decisión.

## Protección del frontend publicado

Antes de publicar cambios en el repo frontend, identificar la versión realmente servida,
la rama de producción y qué operaciones activan previews/despliegues. Un SHA de main por
sí solo no acredita la versión de producción. Registrar una referencia recuperable.

Mantener el despliegue actual hasta validar la nueva pareja y autorizar su publicación.
Un PR puede activar automatizaciones existentes; no crearlo suponiendo ausencia de efectos
externos. Revisar esos desencadenantes antes, sin deshabilitarlos o cambiar protecciones
automáticamente. La documentación de #93 se prepara únicamente en el repo backend.

## Alternativas consideradas

- Frontend nuevo en este repo: duplica una aplicación existente y descarta componentes útiles.
- Trasladar toda la consola al backend: cambia su propiedad e historial sin necesidad actual.
- Tres ramas o repos por entorno: no resuelve el contrato; entornos y repos tienen responsabilidades distintas.

## Consecuencias

Las issues se ejecutan en su repo propietario y se enlazan por URL completa. La CI por
separado no acredita compatibilidad: registrar revisión del contrato y ambos SHA en la
verificación real. Una ampliación incompatible requiere migración coordinada.

La revisión de dependencias, cuotas del repo privado, comandos y autorizaciones de ejecución
precede a habilitar CI frontend. No se incorporan paquetes ni servicios nuevos por este ADR.
La topología futura sigue en su fase; separar repos no acredita DEV/QA/PROD.

Referencias: [spec 005](../../specs/005-frontend-minimo/spec.md),
[plan](../../specs/005-frontend-minimo/plan.md),
[tareas T01](../../specs/005-frontend-minimo/tasks.md), [ADR 0010](0010-ci-por-componente.md).
