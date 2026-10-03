# Spec 001 — Topología de despliegue

- **Estado:** Aprobada
- **Fecha:** 2026-10-01

## Contexto

El sistema se compone de cuatro componentes (Frontend, BFF, API Core y base de datos) que deben
desplegarse en dos entornos, DEV y QA, sobre un máximo de 5 servidores. El entorno de destino es
una operación minera con requisitos estrictos de privacidad, por lo que la infraestructura debe
poder ejecutarse on-premise. Antes de construir los servicios es necesario definir dónde corre
cada componente, cómo se comunican y qué queda expuesto.

## Objetivo

Definir una topología en la que:

- Un usuario accede a cada entorno desde un único punto de entrada.
- En QA, cada componente se ejecuta en su propio servidor y se comunica solo con su capa adyacente,
  replicando la topología esperada en producción.
- DEV concentra todos los componentes en un único servidor para agilizar el desarrollo.
- Los componentes internos no son accesibles desde fuera.
- DEV y QA funcionan de forma aislada entre sí.

## Alcance

- **Incluye:** servidores y rol de cada uno, red privada, punto de entrada, flujos de red
  permitidos, acceso administrativo, separación DEV/QA y diagrama de la topología.
- **No incluye:** HTTPS y certificados, dominio propio, CI/CD, entorno de producción, alta
  disponibilidad y balanceo de carga, respaldos, monitoreo. Se abordan en specs posteriores.

## Supuestos

- **S1 — Destino on-premise:** la operación minera exige privacidad y dispone de presupuesto
  para infraestructura propia. La topología se valida sobre máquinas virtuales en cloud (IaaS)
  usando únicamente componentes con equivalente on-premise.
- **S2 — Reparto de servidores:** DEV consolidado en 1 servidor; QA distribuido en 4 servidores,
  uno por componente. QA es el entorno que debe parecerse a producción (paridad de entornos).
  Ver [ADR 0004](../../docs/adr/0004-reparto-de-entornos-dev-qa.md).

## Restricciones

- Máximo 5 servidores en total entre ambos entornos.
- Costo controlado: los servidores deben poder detenerse fuera de uso sin perder datos ni configuración.

## Requisitos

- **R1 — Distribución por entorno:** en QA, Frontend (servido por Nginx), BFF, API Core y base de
  datos corren en servidores distintos. En DEV corren en un único servidor.
- **R2 — Punto de entrada único:** en cada entorno, solo Nginx acepta tráfico HTTP desde fuera.
  En QA, solo el servidor de Nginx tiene IP pública. En DEV, BFF, API Core y base de datos no
  escuchan en interfaces públicas.
- **R3 — Red privada:** la comunicación entre componentes se realiza por direcciones privadas.
- **R4 — Flujos permitidos solo entre capas adyacentes:**
  Nginx → BFF, BFF → API Core, API Core → base de datos. En QA, cualquier otro flujo de
  aplicación entre servidores se rechaza mediante reglas de red. En DEV, las capas se respetan
  en el código y la configuración; solo API Core recibe las credenciales de la base de datos.
  No se exige aislamiento de red entre procesos locales de DEV. Ver
  [ADR 0005](../../docs/adr/0005-alcance-aislamiento-dev-qa.md).
- **R5 — Acceso administrativo restringido:** el acceso SSH a los servidores solo se permite
  desde direcciones autorizadas. El acceso administrativo es independiente de los flujos de
  aplicación de R4 y puede utilizar un salto SSH autorizado, sin habilitar saltos entre capas
  para la aplicación. Ver [ADR 0006](../../docs/adr/0006-acceso-administrativo-proxyjump.md).
- **R6 — Aislamiento de entornos:** ningún componente de QA puede comunicarse con componentes
  de DEV, y viceversa.
- **R7 — Configuración externa:** las direcciones entre componentes se configuran mediante
  variables de entorno, no en el código.
- **R8 — Arranque autónomo:** al reiniciar un servidor, sus servicios vuelven a ejecutarse sin
  intervención manual.
- **R9 — Portabilidad on-premise:** la topología no depende de servicios gestionados de un
  proveedor cloud; todo componente debe poder ejecutarse en servidores propios.

## Criterios de aceptación

- [ ] **CA1:** en cada entorno, la URL de entrada devuelve el frontend.
- [ ] **CA2:** desde fuera, BFF, API Core y base de datos no responden en ningún entorno.
- [ ] **CA3:** en QA, desde el servidor del BFF, el API Core responde; desde el servidor de Nginx, no responde.
- [ ] **CA4:** en QA, desde el servidor del API Core, la base de datos acepta conexión; desde el servidor del BFF, la rechaza.
- [ ] **CA5:** un intento de SSH desde una dirección no autorizada es rechazado.
- [ ] **CA6:** desde un servidor de QA no es posible conectarse al servidor de DEV, y viceversa.
- [ ] **CA7:** tras reiniciar cualquier servidor, el flujo completo vuelve a funcionar sin intervención.
- [ ] **CA8:** existe un diagrama en `docs/` que coincide con la topología desplegada.
- [ ] **CA9:** la topología solo utiliza máquinas virtuales, redes y reglas de firewall, sin servicios gestionados.

- [ ] **CA10:** en DEV, el código y la configuración respetan las capas adyacentes; BFF no
  accede directamente a SQL Server y las credenciales de base de datos se entregan solo a API Core.

## Preguntas abiertas

- **P1:** ¿El acceso administrativo debe pasar por una VPN o un servidor bastión, o basta con restringir por IP?
- **P2:** ¿Qué sistema operativo y distribución se usará en los servidores?
- **P3:** ¿Qué puertos usarán BFF y API Core internamente?
