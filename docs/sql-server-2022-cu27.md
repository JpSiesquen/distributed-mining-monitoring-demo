# SQL Server 2022 CU27 — fallo conocido durante recuperación

- **Revisión de la fuente:** 2026-10-03.
- **Actualización:** CU27, KB5104824; motor 16.0.4295.3, publicada el 2026-09-15.
- **Estado:** riesgo documentado; no reproducido en el proyecto. No constituye aprobación
  de CU27 para los servidores DEV/QA.

## Condición y efecto

Microsoft informa que consultar `sys.dm_exec_requests` mientras una base se recupera
puede provocar una violación de acceso y terminar el proceso de SQL Server. La recuperación
puede ocurrir durante RESTORE, el arranque o la puesta en línea de una réplica.

La fuente menciona también `sys.sysprocesses` al explicar la mitigación. No debe asumirse
que las herramientas de monitoreo evitan estas consultas sin revisar su funcionamiento.

## Mitigación y evaluación

Microsoft propone evitar esas consultas durante recuperación, habilitar el trace flag 4696
para desactivar el cambio relacionado, o desinstalar CU27.

Para este proyecto, evaluar las consultas de diagnóstico antes de aprobar la actualización.
La consulta de equipos prevista no requiere estas vistas; eso reduce la exposición al caso,
pero no demuestra que el fallo sea imposible. No se ha habilitado el trace flag ni ejecutado
una reproducción del problema. Su uso requiere validar necesidad y consecuencias.

## Verificación posterior a una actualización

- Confirmar la versión efectiva y la conexión al motor.
- Comprobar que la configuración de memoria y de arranque se conserve.
- Revisar problemas conocidos antes de incorporar consultas de monitoreo o restauración.
- Registrar aprobación y resultado observado; descargar un paquete no acredita su instalación.

## Fuente

[Microsoft: KB5104824, Known issues — Access violation when you query sys.dm_exec_requests
 during database recovery](https://support.microsoft.com/en-us/servicing/sql/sql-server-2022/cumulative-update/kb5104824-cu27).

Relacionado con la selección de mantenimiento del [ADR 0007](adr/0007-sistema-operativo-y-version-sql-server.md).
