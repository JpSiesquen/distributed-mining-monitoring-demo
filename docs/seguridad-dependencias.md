# Seguridad de dependencias y ejecución

Actualizado: 2026-10-09. Selección aprobada, instalación local, compilación y CI de build verificadas.

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

Controles de ejecución aprobados el 2026-10-03:

- Local: comandos npm con `--ignore-scripts` y `.npmrc` del proyecto con `ignore-scripts=true`.
- CI: `npm ci --ignore-scripts`; conservar `contents: read` y credenciales no persistidas.
- Si una dependencia exige un script, detenerse y validar una excepción concreta; no quitar
  la protección ni ampliar permisos para que la instalación pase.
- Antes de build/test, comprobar que su entorno no recibe secretos de producción o despliegue.
- Cada actualización debe pasar por revisión de versiones, scripts y lockfile antes de ejecutarse.

Configuración local preparada en la issue #3; npm confirmó `ignore-scripts=true`.
Build válido y bloqueo de emisión ante error de tipos comprobados; esto no acredita ausencia de malware.
El workflow `api-core-ci.yml` aplica `npm ci --ignore-scripts` con `contents: read` y credenciales
no persistidas; primera ejecución correcta en la issue #7. Un check verde no acredita ausencia de malware.

El lockfile aporta reproducibilidad; el check verde acredita solo las comprobaciones ejecutadas.
Ninguno garantiza ausencia de malware. Desactivar scripts tampoco acredita la seguridad del código
que se importará después; cualquier cambio del comando de instalación requiere validación.

## Alertas de Dependabot

Activadas y verificadas el 2026-10-03 en GitHub: grafo de dependencias, alertas de
vulnerabilidades y alertas de malware. Consultar [alertas del repositorio](https://github.com/JpSiesquen/distributed-mining-monitoring-demo/security/dependabot).

El análisis usa los manifiestos y lockfiles publicados en `main`. Comprobado el 2026-10-09:
el grafo incluye las dependencias de `api-core/package-lock.json` y no hay alertas abiertas.
Las alertas identifican dependencias con vulnerabilidades o malware conocidos en la base de
avisos de GitHub; no sustituyen la revisión previa ni bloquean por sí solas una instalación.
[Alcance de las alertas de malware](https://docs.github.com/en/code-security/concepts/supply-chain-security/malware-alerts).
Las actualizaciones automáticas permanecen deshabilitadas; cada cambio mantiene su revisión y aprobación.

## Trazabilidad y evidencia

- [002/T01](../specs/002-api-core-minimo/tasks.md): selección y revisión de dependencias.
- [003/T01](../specs/003-ci-minima/tasks.md): revisión de Actions y autorización de `npm ci`.
- Estado: revisión preliminar de #1 registrada abajo; las cuatro versiones aprobadas.
  Instalación local realizada por el responsable; lockfile contrastado en la issue #3.
  Revisión de Actions y autorización de `npm ci` completadas en la issue #4; CI habilitada en #7.

## Revisión de la issue #1

Fecha: 2026-10-03. Revisión preliminar realizada; Express, TypeScript y tipos aprobados en esta fecha.
La aprobación de versiones no autoriza instalar ni ejecutar paquetes.
Esta revisión preliminar se realizó sin instalar ni ejecutar paquetes; la instalación posterior
se registra abajo.

| Paquete aprobado | Versión | Uso | Tipo |
|------------------|---------|-----|------|
| `express` | `4.22.3` | Servidor y rutas HTTP | Producción |
| `typescript` | `5.9.3` | Comprobación de tipos y compilación | Desarrollo |
| `@types/express` | `4.17.25` | Tipos de Express 4 | Desarrollo |
| `@types/node` | `24.19.1` | Tipos de Node.js 24 | Desarrollo |

El rango anterior `4.21.x` conduce a Express `4.21.2`, que declara `qs@6.13.0`.
Esa versión está afectada por avisos de disponibilidad, entre ellos
[GHSA-4mjr-xmp4-gh2g](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g), corregido en `6.16.0`.
La explotabilidad depende del uso; no se ha reproducido un ataque contra el proyecto.
Se aprueba Express `4.22.3`, que declara `qs~6.16.0`, antes que forzar una dependencia transitiva
mediante overrides. La decisión mantiene Express 4; no autoriza la instalación.
[Metadatos de Express](https://registry.npmjs.org/express/4.22.3);
[commit de publicación](https://github.com/expressjs/express/commit/899b52494e74327905c16164decdc6e51f803af8).

Consulta del registro oficial: Express procede de expressjs/express; TypeScript, de
microsoft/TypeScript; los tipos, de DefinitelyTyped. El registro declara provenance para Express;
no se ha verificado criptográficamente esa attestation.

Se resolvieron preliminarmente 87 versiones directas/transitivas por sus rangos publicados.
La consulta al endpoint de avisos de npm no devolvió coincidencias para ese conjunto.
No se declararon preinstall/install/postinstall; `mime@1.6.0` declara un prepare que genera
types.json. Se leyó ese script del archivo publicado y se comprobó su integridad SHA-512,
sin ejecutarlo. No se auditó todo el código fuente; estos resultados no acreditan ausencia de malware.
El contraste posterior con el lockfile se registra abajo.

### Instalación local — issue #3

El responsable ejecutó los dos comandos indicados con `--ignore-scripts` en Warp.
Ambos terminaron sin errores y npm reportó cero vulnerabilidades conocidas.
Se comprobaron las cuatro versiones aprobadas mediante `npm ls --depth=0`.
Lockfile v3: 82 paquetes, todos con origen en el registro npm oficial; ninguna entrada
declara `hasInstallScript`. Conserva `qs@6.16.0` y `body-parser@1.20.8`.

El grafo real tiene 82 paquetes frente a las 87 versiones de la resolución preliminar.
81 coinciden con versiones e integridades revisadas; `get-intrinsic@1.3.0` se revisó
adicionalmente: origen ljharb/get-intrinsic, integridad coincidente con el registro y sin
scripts preinstall/install/postinstall/prepare declarados.
[Metadatos oficiales](https://registry.npmjs.org/get-intrinsic/1.3.0).
La diferencia refleja la resolución definitiva de npm; no demuestra ausencia de malware.

Verificación de compilación: `npm run build` generó `dist/index.js`. Una copia temporal
con número asignado a string produjo TS2322, código de salida 1 y ningún JavaScript emitido.
La prueba conservó src/index.ts y dist/index.js, y eliminó sus archivos temporales.

Comandos ejecutados por el responsable en `api-core/`:

```powershell
npm install --save-exact --ignore-scripts express@4.22.3
npm install --save-dev --save-exact --ignore-scripts typescript@5.9.3 @types/express@4.17.25 @types/node@24.19.1
```

`--ignore-scripts` evita ejecutar scripts de instalación; no protege frente al código importado
posteriormente. El comando de CI incorpora esa protección. Nuevas instalaciones y la ejecución
de CI requieren su propia autorización.

## Revisión de la issue #59 — BFF

Fecha: 2026-10-13. Revisión preliminar completada sin instalar ni ejecutar paquetes.
Selección y comandos aprobados explícitamente el 2026-10-13 para BFF, a ejecutar en la
issue #60. La issue #59 no instala paquetes; la aprobación previa de API Core no se utilizó
como autorización de esta instalación.

| Paquete aprobado | Versión | Finalidad | Tipo |
|-------------------|---------|-----------|------|
| express | 4.22.3 | Servidor y rutas del BFF | Producción |
| typescript | 5.9.3 | Tipos y compilación | Desarrollo |
| @types/express | 4.17.25 | Tipos de Express 4 | Desarrollo |
| @types/node | 24.19.1 | Tipos de Node.js 24 | Desarrollo |

Conservar las versiones exactas revisadas de API Core evita una divergencia injustificada;
fetch, cancelación, logs y pruebas se resuelven con Node.js, sin dependencias adicionales.
Runtime local comprobado: 24.21.0. Los mínimos declarados de Express y TypeScript admiten
ese runtime; los paquetes de tipos corresponden a Express 4 y Node 24. Compilación y pruebas
del BFF se verificarán al existir su proyecto, no se acreditan con esta revisión.

Se reconsultaron los metadatos oficiales de las 82 versiones del lockfile actual de API Core:
identidades e integridades coincidentes, sin paquetes deprecados ni entradas hasInstallScript
en el lockfile. La consulta actual al endpoint de avisos npm no devolvió coincidencias.
Origen directo: expressjs/express, microsoft/TypeScript y DefinitelyTyped.
El único script de ciclo de vida declarado es prepare de mime@1.6.0; su lectura previa e
integridad revisada se conservan. No se ejecutó. No se verificaron criptográficamente las
attestations ni se auditó todo el código; no se acredita ausencia de malware.

Esta evidencia corresponde al grafo existente, no a una resolución definitiva del BFF.
En 004/T02 contrastar versiones, origen, integridades, avisos y scripts del lockfile nuevo;
revisar cualquier diferencia antes de ejecutar build o pruebas. No forzar transitivas mediante
overrides sin una decisión revisada.

Comandos aprobados, exclusivamente en bff/ al preparar el proyecto en la issue #60,
después de crear package.json y .npmrc con ignore-scripts=true:

```powershell
npm install --save-exact --ignore-scripts express@4.22.3
npm install --save-dev --save-exact --ignore-scripts typescript@5.9.3 @types/express@4.17.25 @types/node@24.19.1
```

La issue #59 registra revisión y autorización; no realiza la instalación.

Instalación #60 (2026-10-13): los comandos aprobados se ejecutaron en bff/ con ignore-scripts
efectivo y sin credenciales heredadas ni configuración npm privada. npm reportó cero avisos.
Lockfile v3 definitivo: 82 paquetes, todos con versiones e integridades coincidentes con
el conjunto revalidado; origen registry.npmjs.org y ninguna entrada hasInstallScript.
No hubo diferencias de grafo. npm ls confirma las cuatro versiones; build correcto y caso
TS2322 controlado verificados. Este contraste no acredita ausencia de malware.

Fuentes: [Express](https://registry.npmjs.org/express/4.22.3),
[TypeScript](https://registry.npmjs.org/typescript/5.9.3),
[tipos Express](https://registry.npmjs.org/@types%2fexpress/4.17.25),
[tipos Node](https://registry.npmjs.org/@types%2fnode/24.19.1).

### Ejecución de CI BFF — issue #61

Preparada y ejecución autorizada explícitamente el 2026-10-13 para publicar y validar CI BFF.
Revalidación de SHA oficiales checkout/setup-node y action.yml: runtime node24, sin cambio
de versiones respecto de API Core. Node de aplicación 24.21.0; Ubuntu 22.04 estándar;
contents: read, persist-credentials: false y package-manager-cache: false.

Comandos aprobados en bff/: comprobar .npmrc y valor efectivo ignore-scripts=true,
npm ci --ignore-scripts y npm run build. El lockfile final de #60 ya está contrastado;
no se incorporan dependencias ni scripts de instalación. Sin secretos de producción,
despliegue o servicios SQL. Validar un caso correcto y un error de tipos sin integrar la prueba;
añadir el check bff al ruleset después de validar su ejecución, conservando api-core.

Validación de #61: ambos jobs correctos en ejecución 38477039523; error de tipos BFF
TS2322 con api-core correcto en 38477153451 y PR #84 bloqueado. Recuperación correcta
en 38477303301; PR temporal cerrado sin integrar. Ruleset verificado por lectura posterior:
api-core y bff obligatorios (app GitHub Actions 15368), restantes controles conservados.
Evidencia enlazada en [CI](ci.md#ampliación-bff--issue-61).

Ejecución npm test en CI BFF autorizada el 2026-10-13 en #66. Suite correcta y fallos
independientes de aserción, instalación y política verificados; pasos posteriores omitidos
cuando correspondía. PR temporal #90 restaurado/cerrado sin integrar; recuperación correcta.
No se añadieron dependencias, permisos ni secretos. [Evidencia](ci.md#pruebas-bff-y-detención-de-pasos--issue-66).
