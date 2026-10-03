# ADR 0007 — Sistema operativo y versión de SQL Server

- **Estado:** Aceptada
- **Fecha:** 2026-10-02

## Contexto

Los cinco servidores necesitan una base Linux compatible con los componentes del sistema.
El stack define SQL Server como motor, sin fijar su versión. Mantener una distribución común
reduce diferencias de administración entre DEV y QA.

## Decisión

- Utilizar Ubuntu Server 22.04 LTS en las cinco VMs.
- Utilizar SQL Server 2022 en los servidores DEV y datos QA.
- Validar la edición y actualización de mantenimiento exactas antes de instalar. Ubuntu 22.04
  está soportado desde SQL Server 2022 CU10; el mínimo de compatibilidad no sustituye la elección
  de una actualización con las correcciones correspondientes.

Ver [compatibilidad oficial de Microsoft](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver16).

## Alternativas consideradas

- **Mezclar distribuciones:** introduce diferencias en comandos, paquetes y administración sin
  un requisito actual que las justifique.
- **Ubuntu 24.04 con SQL Server 2025:** ofrece una ventana de mantenimiento estándar más larga
  para el SO, pero no se necesitan las novedades del motor para el alcance actual.

## Consecuencias

- DEV y QA comparten distribución y versión principal del motor.
- No se instala software ni se elige un driver como parte de esta decisión.
- Ubuntu 22.04 tiene mantenimiento estándar hasta mayo de 2027; si el despliegue continúa más
  allá, habrá que validar una actualización o cobertura de mantenimiento antes de ese límite.
  Ver [ciclo oficial de Ubuntu](https://ubuntu.com/about/release-cycle).
