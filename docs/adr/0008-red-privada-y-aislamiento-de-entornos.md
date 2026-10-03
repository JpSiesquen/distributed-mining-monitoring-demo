# ADR 0008 — Red privada y aislamiento de entornos

- **Estado:** Aceptada
- **Fecha:** 2026-10-02

## Contexto

El ADR 0003 define una VNet con subredes y reglas de firewall para validar la topología en Azure.
DEV y QA deben quedar aislados, y QA debe permitir únicamente los flujos de aplicación entre
capas adyacentes. Separar subredes no bloquea por sí solo la comunicación.

## Decisión

- Usar una VNet con dos subredes: DEV y QA.
- Aplicar un NSG por interfaz de VM y complementar con el firewall del sistema.
- Permitir en QA los flujos de aplicación Nginx → BFF → API Core → SQL Server, por origen,
  destino y puerto; rechazar las conexiones nuevas que salten capas.
- Bloquear DEV → QA y QA → DEV, también las conexiones que utilicen sus IP públicas.
- Mantener los permisos administrativos del ADR 0006 separados de los flujos de aplicación.
- Establecer reglas explícitas de rechazo con precedencia sobre los permisos predeterminados
  de la VNet. Verificar los flujos permitidos y prohibidos con conexiones nuevas.
- Validar rangos CIDR, IP, nombres y excepciones operativas antes del aprovisionamiento.

## Alternativas consideradas

- **Dos VNets sin conexión:** también permite separar entornos, pero no se necesita modificar
  el diseño de una VNet ya aceptado para cumplir el aislamiento con reglas verificables.
- **Dos subredes sin restricciones adicionales:** no cumple R6 ni los bloqueos entre capas de R4.

## Consecuencias

- Se conservan cinco VMs y un modelo portable a redes y firewalls on-premise.
- La protección depende de las reglas, no solo de la separación en subredes.
- CA6 se verifica en ambos sentidos y con controles positivos de disponibilidad del destino.
- Las restricciones deben revisarse cuando cambien direcciones o conexiones necesarias.
