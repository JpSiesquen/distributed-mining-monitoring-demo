# Seguridad de dependencias y ejecución

Actualizado: 2026-10-03. Revisión de dependencias del proyecto pendiente.

## Riesgo documentado

Shai-Hulud es una campaña de malware autorreplicante contra la cadena de suministro npm.
El informe de Aikido del 2026-09-07 documenta la reaparición de un payload conocido en
cuatro versiones de paquetes, con ejecución mediante `preinstall` y persistencia en
configuración de herramientas de desarrollo. [Fuente primaria](https://www.aikido.dev/blog/shai-hulud-npm-resurfaces).

GitHub describe el uso de scripts de ciclo de vida y credenciales comprometidas para robar
secretos y propagar paquetes maliciosos. [Análisis de GitHub](https://github.blog/security/supply-chain-security/strengthening-supply-chain-security-preparing-for-the-next-malware-campaign/).
Estos informes no demuestran que este repositorio o equipo estén comprometidos.

## Control previo a la ejecución

Aplicar la [política de dependencias](../AGENTS.md#política-de-dependencias-y-ejecución):

- Revisar origen, versiones exactas y avisos vigentes de las dependencias seleccionadas.
- Revisar scripts de ciclo de vida directos y transitivos antes de autorizar su ejecución.
- Registrar paquetes, fuentes, fecha de revisión, hallazgos y comando propuesto.
- Mantener bloqueada la instalación o ejecución si la revisión o aprobación está pendiente.
- En CI, aplicar los SHA y permisos mínimos aprobados, sin credenciales SQL, SSH ni Azure.

El lockfile aporta reproducibilidad; el check verde acredita solo las comprobaciones ejecutadas.
Ninguno garantiza ausencia de malware. Desactivar scripts tampoco acredita la seguridad del código
que se importará después; cualquier cambio del comando de instalación requiere validación.

## Trazabilidad y evidencia

- [002/T01](../specs/002-api-core-minimo/tasks.md): selección y revisión de dependencias.
- [003/T01](../specs/003-ci-minima/tasks.md): revisión de Actions y autorización de `npm ci`.
- Estado: sin revisión ejecutada ni evidencia de ausencia de compromiso. Registrar los resultados
  en el PR correspondiente antes de habilitar instalaciones o CI.
