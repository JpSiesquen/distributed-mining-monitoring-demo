# Plan 003 — CI mínima de compilación y pruebas

- **Spec:** [003](spec.md)
- **Estado:** Aprobado
- **Fecha:** 2026-10-03

## Enfoque

Definir un workflow de GitHub Actions que compruebe únicamente API Core.
Primero ejecutar instalación reproducible y compilación; añadir pruebas en el mismo job
cuando existan. Spec y plan aprobados el 2026-10-03; implementación pendiente.

## Diseño

Archivo previsto: `.github/workflows/api-core-ci.yml`. No se crea en esta revisión.
Un job llamado `api-core` con pasos secuenciales:

```
Obtener código → preparar Node.js → npm ci --ignore-scripts → npm run build → npm test
```

Los comandos npm se ejecutan en `api-core/`. El checkout ocurre antes de ejecutar comandos
sobre esa carpeta. El workflow se incorpora cuando existan package.json, lockfile y build.
El paso npm test se añade al implementar las pruebas de 002; desde ese momento es obligatorio,
sin opciones que oculten la ausencia del script o conviertan un fallo en éxito.

| Parámetro | Selección y estado |
|-----------|----------------------------------|
| Disparadores | Aprobados: push a main y pull_request hacia main. Sin filtros de rutas en el borrador inicial. |
| Runner | Aprobado: estándar hospedado por GitHub, Linux x64, etiqueta ubuntu-22.04. |
| Runtime de aplicación | Node.js 24, coherente con el plan 002. Aprobado: misma versión exacta (major.minor.patch) en desarrollo y CI; Versión aprobada: 24.21.0. |
| Permisos | Aprobado: contents: read. Sin permisos de escritura ni secretos de despliegue. |
| Obtención de código | Versión aprobada: actions/checkout v7.0.1, SHA completo indicado abajo, persist-credentials: false. |
| Preparación de Node.js | Versión aprobada: actions/setup-node v7.0.0, SHA completo indicado abajo; node-version: 24.21.0 y package-manager-cache: false. |

Versiones consultadas y aprobadas el 2026-10-03 para el plan:

| Acción | Versión | Commit verificado en su repositorio oficial |
|--------|---------|---------------------------------------------|
| actions/checkout | v7.0.1 | 3d3c42e5aac5ba805825da76410c181273ba90b1 |
| actions/setup-node | v7.0.0 | 820762786026740c76f36085b0efc47a31fe5020 |

Consultadas las notas de publicación y action.yml de esos commits: ambas acciones usan
runtime node24. El runtime interno de las acciones es independiente de la versión de
Node.js preparada para API Core. Desactivar explícitamente la caché automática de npm
en setup-node mediante package-manager-cache: false, coherente con el alcance inicial.
Esta comprobación no equivale a una auditoría completa del código o sus dependencias.
Antes de habilitar, completar la revisión de seguridad y compatibilidad del runner y
obtener aprobación de acciones, runtime y comandos. No asumir que aprobar el plan
por sí solo autoriza ejecutar instalaciones o acciones externas.
Las dependencias exactas y sus scripts se aprueban en T01 de 002; el comando de instalación
previsto en CI es `npm ci --ignore-scripts`, con dependencias de producción y desarrollo necesarias para build.

Conservar el resultado y logs de cada ejecución en GitHub Actions. Un fallo de instalación,
compilación o pruebas hace fallar el job; no usar continue-on-error ni ignorar códigos de salida.
No configurar credenciales SQL, SSH o Azure ni invocar servicios del cliente.

## Decisiones

Disparadores push a main y pull_request hacia main aprobados el 2026-10-03.
Runner estándar hospedado por GitHub, Linux x64, ubuntu-22.04 aprobado el 2026-10-03.
Política de Node.js aprobada el 2026-10-03: desarrollo y CI usan la misma versión exacta;
las actualizaciones se realizan explícitamente en ambos entornos. Versión 24.21.0 aprobada.
Permiso de contenido contents: read aprobado el 2026-10-03 para la CI de compilación y pruebas.
Versiones de actions/checkout v7.0.1 y actions/setup-node v7.0.0, fijadas a los SHA indicados,
aprobadas el 2026-10-03 para el plan. Spec y plan completos aprobados en la misma fecha.

- Un solo job y runtime: suficiente para el API existente; sin matriz de sistemas/versiones.
- Runner hospedado: evita mantener una máquina de CI o dar acceso a servidores de aplicación.
- Build obligatorio: omitirlo si falta daría una comprobación incompleta.
- Pruebas añadidas por un cambio explícito del mismo workflow, sin duplicarlo.
- Sin caché ni publicación de artefactos iniciales: incorporarlas solo con una necesidad concreta.
- Permisos de lectura y acciones fijadas: limitar acceso y mantener identificable el código externo.

Decisión registrada en el [ADR 0009](../../docs/adr/0009-ci-minima-api-core.md).

## Respuesta a preguntas abiertas

- **P1:** diseño y versiones aprobados. Completar la revisión previa de seguridad,
  dependencias y compatibilidad antes de habilitar el workflow.
  Visibilidad pública verificada el 2026-10-03. Los runners estándar son gratuitos para
  repositorios públicos según la documentación consultada; revalidar condiciones al habilitar.

## Trazabilidad

| Requisito | Cómo se cumple |
|-----------|----------------|
| R1 | Un workflow con contents: read, sin secretos de despliegue ni credenciales persistidas. |
| R2 | npm ci --ignore-scripts desde lockfile aprobado; build obligatorio y pruebas al existir, solo en api-core/. |
| R3 | Pasos secuenciales sin ignorar fallos; verificar ejecuciones válidas y fallos controlados. |
| R4 | Validar versiones/SHA, permisos, instalación y condiciones antes de incorporar el workflow. |

## Riesgos

- Shai-Hulud: aplicar la [revisión previa](../../docs/seguridad-dependencias.md) antes de
  instalar o ejecutar CI. Revisión pendiente; lockfile y CI verde no garantizan ausencia de malware.

- Check verde sin pruebas: indicar la fase de build y añadir pruebas antes de cerrar CA3/003.
- Scripts de instalación externos: aplicar evaluación y aprobación de dependencias de 002.
- Dependencia o acción alterada: lockfile aprobado y acciones fijadas a SHA verificado.
- Prueba deja servidor abierto: limpieza garantizada en el diseño de pruebas de 002.
- Linux revela diferencias de rutas: probar el código compilado y carga del JSON en el runner.
- Cambio de condiciones o imagen disponible: comprobar soporte y costos antes de habilitar.
- CI exitosa interpretada como despliegue exitoso: CA y documentación distinguen ambos resultados.

## Referencias

- [Build y pruebas Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).
- [Runners hospedados y condiciones](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).
- [Sintaxis y permisos](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).
- [checkout](https://github.com/actions/checkout) y [setup-node](https://github.com/actions/setup-node).

- Versiones de acciones: [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)
  y [setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0).

- Runtime aprobado para el plan: [Node.js 24.21.0 LTS](https://nodejs.org/en/blog/release/v24.21.0).
