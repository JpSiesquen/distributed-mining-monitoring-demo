# ADR 0002 — SQL Server y repositorios mock con contrato común

- **Estado:** Aceptada
- **Fecha:** 2026-10-01

## Contexto

Parte de los dominios (posición y movimientos de equipos) tiene una fuente de datos relacional;
otros todavía no cuentan con fuente real. El API Core debe poder servir ambos casos sin que las
capas superiores dependan del origen de los datos.

## Decisión

- Usar **SQL Server** como base de datos del API Core.
- Abstraer el acceso a datos mediante **repositorios** con un contrato común:
  - Dominios con fuente real: repositorio sobre SQL Server.
  - Dominios sin fuente real: repositorio mock basado en JSON.

## Alternativas consideradas

- **PostgreSQL / MySQL:** igualmente válidas, pero SQL Server es el motor del entorno objetivo.
- **Esperar a tener todas las fuentes reales:** bloquearía el desarrollo del BFF y del frontend.

## Consecuencias

- Un repositorio mock puede sustituirse por uno real sin modificar rutas, BFF ni frontend.
- Se mantienen dos implementaciones por dominio durante la transición.
- SQL Server requiere al menos 2 GB de RAM, lo que condiciona el tamaño del servidor de datos.
