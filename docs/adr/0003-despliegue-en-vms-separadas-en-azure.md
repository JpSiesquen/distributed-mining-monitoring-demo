# ADR 0003 — Despliegue en VMs separadas en Azure

- **Estado:** Aceptada
- **Fecha:** 2026-10-01

## Contexto

Cada componente debe ejecutarse en su propio servidor, comunicado por red privada, con entornos
DEV y QA. El entorno de destino es on-premise: las operaciones mineras exigen privacidad y
mantienen los datos dentro de su propia infraestructura. El entorno de validación debe usar solo
componentes con equivalente directo en servidores propios.

## Decisión

- **Desarrollo local** para la construcción diaria de los servicios.
- **Máquinas virtuales Linux en Azure** para los entornos desplegados, dentro de una Virtual
  Network con subredes y Network Security Groups.
- Solo el punto de entrada (Nginx) tiene IP pública; BFF, API Core y SQL Server quedan en red privada.
- No se utilizan servicios gestionados del proveedor: todo lo desplegado debe poder ejecutarse on-premise.

## Alternativas consideradas

- **Servicios gestionados (App Service, Azure SQL):** menor operación, pero ocultan la
  administración de servidores y no reflejan un escenario on-premise.
- **Virtualización local:** sin costo, pero insuficiente para ejecutar varios servidores y
  SQL Server en paralelo en una estación de trabajo.

## Consecuencias

- El modelo (VNet ≈ red privada, NSG ≈ firewall, VM ≈ servidor) se traslada directamente a on-premise.
- Mayor responsabilidad operativa: actualizaciones, procesos persistentes y seguridad de cada VM.
- Requiere control de costos: VMs desasignadas fuera de uso y alertas de presupuesto.
