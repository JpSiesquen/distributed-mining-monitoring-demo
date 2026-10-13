# CI de API Core

Verificada: 2026-10-12. Workflow: [api-core-ci.yml](../.github/workflows/api-core-ci.yml).
Alcance y aceptación: [spec 003](../specs/003-ci-minima/spec.md).

## Ejecución

Se ejecuta al hacer push a `main` y al abrir o actualizar un pull request hacia `main`.
Un único job, `api-core`, usa `ubuntu-22.04`, Node.js `24.21.0` y un límite de cinco minutos.
Los comandos se ejecutan en `api-core/`.

```text
Checkout → Node.js → política npm → instalación → build → seis pruebas
```

| Paso | Comprobación |
|------|--------------|
| Verify npm script policy | `.npmrc` existe y contiene `ignore-scripts=true`; npm aplica ese valor. |
| Install dependencies | `npm ci --ignore-scripts` instala desde el lockfile aprobado. |
| Build | `npm run build` comprueba tipos, compila y copia el JSON mock a `dist/data/`. |
| Test | `npm test` ejecuta `node --test test/api.test.mjs` sobre la aplicación compilada. |

Las seis pruebas cubren salud, listado mock, ruta inexistente, ausencia de X-Powered-By,
error de lectura del mock y disponibilidad de salud sin el archivo de datos.
El archivo de pruebas se indica explícitamente para evitar un patrón sin coincidencias.
Un fallo detiene los pasos posteriores; no hay `continue-on-error`.

## Permisos y protección

- `contents: read`; checkout con `persist-credentials: false` y caché npm desactivada.
- Checkout v7.0.1: `3d3c42e5aac5ba805825da76410c181273ba90b1`.
- Setup-node v7.0.0: `820762786026740c76f36085b0efc47a31fe5020`.
- Dependencias y ejecución aprobadas: [registro de seguridad](seguridad-dependencias.md)
  y [003/T01](../specs/003-ci-minima/tasks.md).
- Sin credenciales SQL, SSH o Azure ni pasos de despliegue.
- Ruleset `Proteger main`: PR obligatorio y check `api-core` de GitHub Actions exitoso;
  bloquea push directo, force push y eliminación. No tiene excepciones.
  Cambiar el nombre del job exige actualizar el ruleset en el mismo cambio.

Un check verde acredita compilación y pruebas de este alcance. No acredita SQL Server,
despliegue, disponibilidad de los servidores ni ausencia de malware.

## Consultar resultados y diagnosticar

En GitHub: **Actions → API Core CI → ejecución → job api-core → paso**.
Desde un PR, abrir **Checks** y el detalle de `api-core`.

```powershell
gh run list --workflow api-core-ci.yml --limit 5 --repo JpSiesquen/distributed-mining-monitoring-demo
gh run view 38330299235 --log-failed --repo JpSiesquen/distributed-mining-monitoring-demo
```

El segundo comando muestra un caso de prueba fallida verificado. Sustituir su ID por el
de la ejecución que se quiera diagnosticar.

| Paso fallido | Acción |
|--------------|--------|
| Verify npm script policy | Restaurar la protección y comprobar su valor efectivo; no quitar el control. |
| Install dependencies | Revisar presencia y coherencia del lockfile; no ignorar el error ni activar scripts. |
| Build | Corregir el diagnóstico TypeScript; no ejecutar una compilación anterior como solución. |
| Test | Comparar actual/expected y el contrato; corregir el defecto o revisar el requisito antes de cambiar la prueba. |

## Evidencia de aceptación

| Criterio | Evidencia verificada |
|----------|----------------------|
| CA1: build y pruebas válidos | [Push a main con seis pruebas](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38331190475). |
| CA2: error de tipos falla | [Build TS2322, salida 1](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38005783211); PR #40 cerrado sin integrar. |
| CA3: contrato incorrecto falla | [Test ERR_ASSERTION, salida 1](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38330299235). |
| CA4: disparadores y diagnóstico | [Pull request](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38330551967), [push](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38331190475) y [npm ci EUSAGE, Build/Test omitidos](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38330372809). |
| CA5: configuración y permisos aprobados | [Revisión T01 y logs T02](../specs/003-ci-minima/tasks.md); workflow actual y log de push confirman Node 24.21.0, permisos de lectura y scripts de instalación desactivados. |
| CA6: integración protegida | [PR #43 fallido sin integrar](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/43), [PR #44 válido integrado](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/pull/44); rechazo GH013 de push directo registrado en [T08](../specs/003-ci-minima/tasks.md). Ruleset 24823068 activo y sin excepciones. |
| CA7: límite y control válidos | Job declara timeout-minutes: 5; [ejecución válida](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38329999392). |
| CA8: protección ausente falla antes de instalar | [Fallo del control](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38329828502) y [recuperación](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38329888354). |

PRs temporales #53 y #54 cerrados sin integrar. La restauración de #54 terminó en
[verde](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38330429291)
y su árbol se contrastó idéntico a `main`.
