# ADR 0005 — Alcance del aislamiento en DEV y QA

- **Estado:** Aceptada
- **Fecha:** 2026-10-02

## Contexto

DEV concentra todos los componentes en un servidor; QA los distribuye en cuatro, según el
ADR 0004. Escuchar en `127.0.0.1` evita el acceso externo a los servicios internos de DEV,
pero no impide que un proceso local se conecte a otra capa dentro de la misma máquina.
R4 debe distinguir qué protección se exige en cada entorno.

## Decisión

- En ambos entornos, el código y la configuración respetan Frontend → BFF → API Core → datos.
- En DEV, solo API Core recibe las credenciales de SQL Server. No se exige aislamiento de red
  entre procesos locales; los servicios internos siguen escuchando en loopback.
- En QA, las reglas de red rechazan los flujos de aplicación entre servidores no adyacentes.
- El aislamiento de red entre DEV y QA se mantiene en ambos sentidos (R6).

## Alternativas consideradas

- **Aislamiento adicional entre procesos de DEV:** añadiría configuración y operación para
  reproducir restricciones que QA ya debe validar entre servidores. No es necesario para el
  alcance actual del entorno consolidado.
- **Separación solo por código en QA:** no cumple la validación de bloqueos entre servidores
  exigida por R4 y los criterios CA3/CA4.

## Consecuencias

- DEV conserva una configuración simple; QA verifica los límites de red de la topología distribuida.
- Loopback no se presenta como protección frente a conexiones entre procesos locales de DEV.
- Las credenciales limitan el acceso a datos, pero no constituyen aislamiento entre procesos
  frente a un administrador o un compromiso de toda la máquina.
- La spec incluye CA10 para verificar código y configuración de DEV.
