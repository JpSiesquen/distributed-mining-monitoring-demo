# CI de API Core y BFF

Verificación API Core: 2026-10-12; BFF de compilación y pruebas: 2026-10-13.
Workflow: [api-core-ci.yml](../.github/workflows/api-core-ci.yml).
Alcance: [spec 003](../specs/003-ci-minima/spec.md) y [004/T03, T08](../specs/004-bff-minimo/tasks.md).

## Ejecución

Se ejecuta al hacer push a `main` y al abrir o actualizar un pull request hacia `main`.
El job `api-core` usa `ubuntu-22.04`, Node.js `24.21.0` y un límite de cinco minutos.
Los comandos se ejecutan en `api-core/`.

```text
Checkout → Node.js → política npm → instalación → build → pruebas de contrato/HTTP
```

| Paso | Comprobación |
|------|--------------|
| Verify npm script policy | `.npmrc` existe y contiene `ignore-scripts=true`; npm aplica ese valor. |
| Install dependencies | `npm ci --ignore-scripts` instala desde el lockfile aprobado. |
| Build | `npm run build` comprueba tipos, compila y copia el JSON mock a `dist/data/`. |
| Test | `npm test` ejecuta `node --test test/api.test.mjs` sobre la aplicación compilada. |

La suite conserva salud, equipos, 404 y errores seguros, y añade eventos v1: validación estricta,
UTC, orden, folios, evidencia de prueba y respuestas 500 ante fuente ausente o inválida.
La ampliación #94 pasa 65 pruebas localmente; sus ejecuciones CI se registran con el PR.
El archivo de pruebas se indica explícitamente para evitar un patrón sin coincidencias.
Un fallo detiene los pasos posteriores; no hay `continue-on-error`.

## Permisos y protección

- `contents: read`; checkout con `persist-credentials: false` y caché npm desactivada.
- Checkout v7.0.1: `3d3c42e5aac5ba805825da76410c181273ba90b1`.
- Setup-node v7.0.0: `820762786026740c76f36085b0efc47a31fe5020`.
- Dependencias y ejecución aprobadas: [registro de seguridad](seguridad-dependencias.md)
  y [003/T01](../specs/003-ci-minima/tasks.md).
- Sin credenciales SQL, SSH o Azure ni pasos de despliegue.
- Ruleset `Proteger main`: PR obligatorio y checks `api-core`/`bff` de GitHub Actions exitosos;
  bloquea push directo, force push y eliminación. No tiene excepciones.
  Cambiar el nombre del job exige actualizar el ruleset en el mismo cambio.

Un check verde acredita compilación y pruebas de este alcance. No acredita SQL Server,
despliegue, disponibilidad de los servidores ni ausencia de malware.

## Ampliación BFF — issue #61

Job bff verificado e integrado el 2026-10-13 en PR #83. Ejecuta en bff/:
política npm → npm ci --ignore-scripts → npm run build. Reutiliza runner, runtime, Actions
fijadas y permisos de API Core, con cinco minutos y caché desactivada. El paso npm test
ejecuta once pruebas HTTP tras build, validado e integrado en PR #89.

Los SHA oficiales y runtime node24 de ambas Actions se revalidaron el 2026-10-13.
El repositorio es público; la ejecución usa runners estándar hospedados, gratuitos
según [facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
No crea artefactos almacenados ni caché npm. Ruleset 24823068 activo: exige api-core y bff
de la app GitHub Actions (15368), sin retirar controles previos. Incorporado tras validar el nuevo job.

| Caso | Resultado / evidencia |
|------|-----------------------|
| Build válido | api-core y bff correctos: [ejecución 38477039523](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38477039523). |
| Error de tipos BFF | TS2322/salida 1; api-core correcto; PR #84 BLOCKED con ambos checks exigidos: [ejecución 38477153451](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38477153451). |
| Recuperación | Error retirado, árbol temporal idéntico al cambio real; ambos jobs correctos: [ejecución 38477303301](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38477303301). PR #84 cerrado sin integrar. |

Los casos de #61 acreditan compilación y bloqueo por tipos. La suite HTTP y sus fallos en CI
se verifican a continuación. El check frontend se exige únicamente en su propio repo; no se añade al ruleset backend.

## Pruebas BFF y detención de pasos — issue #66

Ejecución npm test autorizada el 2026-10-13; no se añadieron dependencias ni permisos.

| Caso | Evidencia / resultado |
|------|----------------------|
| Suite correcta | [38481714555](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38481714555): 11/11 BFF, ambos checks correctos. |
| Expectativa incorrecta | [38481897948](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38481897948): instalación/build correctos, Test ERR_ASSERTION/salida 1; api-core correcto, PR #90 BLOCKED. |
| Lockfile ausente | [38482001925](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38482001925): instalación EUSAGE/salida 1; Build/Test omitidos, PR #90 BLOCKED. |
| .npmrc ausente | [38482086736](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38482086736): política falla antes de instalar; instalación/Build/Test omitidos, PR #90 BLOCKED. |
| Restauración | [38482196835](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/actions/runs/38482196835): ambos jobs correctos; árbol temporal idéntico al cambio real. PR #90 cerrado sin integrar. |

Los fallos se provocaron por separado y se retiraron. El ruleset sigue exigiendo api-core/bff
de GitHub Actions. Ningún caso negativo se integró; no usar continue-on-error para ocultar fallos.

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

## CI de la consola en su propio repositorio

Frontend #39 integrado en [PR #53](https://github.com/JpSiesquen/mining-ops-console/pull/53),
merge 88d5b589. El job frontend compila con política npm previa, scripts bloqueados, lectura
y cinco minutos; tipos/política/recuperación verificados. Ruleset exige frontend en ese repo;
backend conserva api-core/bff. [Registro frontend](https://github.com/JpSiesquen/mining-ops-console/blob/88d5b58977ccc10c0501713490d5f58d1f739d2a/docs/ci.md).
CI de main y producción Vercel contrastadas tras el merge. Esto no acredita integración de eventos ni pruebas DOM, pendientes de sus tareas.
