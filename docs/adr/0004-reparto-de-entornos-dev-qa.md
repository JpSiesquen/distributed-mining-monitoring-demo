# ADR 0004 — Reparto de entornos: DEV consolidado y QA distribuido

- **Estado:** Aceptada
- **Fecha:** 2026-10-01

## Contexto

Se dispone de un máximo de 5 servidores para los entornos DEV y QA. Con cuatro componentes
(Nginx + Frontend, BFF, API Core y SQL Server), no es posible distribuir ambos entornos con un
servidor por componente. Hay que decidir cuál de los dos replica la topología de producción.

## Decisión

- **QA distribuido en 4 servidores**, uno por componente, con la misma topología de red que
  tendría producción.
- **DEV consolidado en 1 servidor**, con todos los componentes en la misma máquina.

QA es el último entorno antes de producción; su función es validar el sistema en condiciones
equivalentes a las reales (paridad de entornos).

## Alternativas consideradas

- **DEV distribuido y QA consolidado:** DEV reproduciría la red real, pero QA dejaría de validar
  la comunicación entre servidores. Errores de firewall, direcciones o latencia pasarían QA y
  aparecerían recién en producción.
- **Ambos entornos consolidados:** menor costo, pero ningún entorno validaría la topología distribuida.

## Consecuencias

- Los problemas de red se detectan en QA, antes de producción, y no en DEV.
- DEV es más económico y rápido de operar.
- La configuración por variables de entorno debe permitir ambos modos: direcciones locales en DEV
  y direcciones privadas entre servidores en QA.
