# ADR 0006 — Acceso administrativo mediante ProxyJump

- **Estado:** Aceptada
- **Fecha:** 2026-10-02

## Contexto

QA tiene cuatro servidores y solo su entrada dispone de IP pública. DEV ocupa el quinto
servidor. Se necesita administrar las VMs privadas sin exponer SSH directamente a Internet
ni añadir servicios gestionados o un sexto servidor.

## Decisión

- Acceder por SSH a DEV y a la entrada QA solo desde la IP pública administrativa autorizada.
- Acceder a BFF, API Core y datos QA mediante OpenSSH ProxyJump, usando la entrada QA como salto.
- Permitir SSH hacia esas VMs privadas únicamente desde la IP privada de la entrada QA.
- Mantener las claves privadas en el equipo administrador, sin copiarlas al salto ni usar
  reenvío del agente SSH. Limitar el reenvío del salto a los destinos SSH administrativos.
- Separar estos permisos administrativos (R5) de los flujos de aplicación (R4). El salto no
  autoriza conexiones de Nginx a los puertos de aplicación del API Core o de SQL Server.

## Alternativas consideradas

- **VPN:** permite acceso a la red privada, pero añade configuración y mantenimiento que no
  son necesarios para el acceso SSH del alcance actual.
- **Bastión dedicado:** separa administración y entrada HTTP, pero requiere un sexto servidor.
- **Azure Bastion:** introduce un servicio gestionado incompatible con la restricción R9.
- **IP pública en cada VM QA:** incumple R2 y aumenta la exposición de los servidores internos.

## Consecuencias

- Se mantiene el límite de cinco servidores y las VMs internas conservan solo IP privada.
- Si la entrada QA no está disponible, el acceso administrativo por este camino también se pierde.
- La entrada combina HTTP y salto SSH; su compromiso aumenta el riesgo para los servidores
  internos. Restringir destinos y mantener la autenticación SSH en cada servidor.
- Si cambia la IP pública del administrador, actualizar la regla de origen autorizado mediante
  el acceso al plano de administración de infraestructura, sin abrir SSH a todo Internet.
- Verificar el acceso autorizado a cada VM privada y el rechazo desde un origen no autorizado
  (CA5), además de comprobar que los saltos de aplicación siguen bloqueados (CA3/CA4).
