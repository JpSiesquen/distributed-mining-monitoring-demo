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

El análisis requiere publicar los manifiestos y lockfiles en `main`; todavía no existen.
Las alertas identifican dependencias con vulnerabilidades o malware conocidos en la base de
avisos de GitHub; no sustituyen la revisión previa ni bloquean por sí solas una instalación.
[Alcance de las alertas de malware](https://docs.github.com/en/code-security/concepts/supply-chain-security/malware-alerts).
Las actualizaciones automáticas permanecen deshabilitadas; cada cambio mantiene su revisión y aprobación.

## Trazabilidad y evidencia

- [002/T01](../specs/002-api-core-minimo/tasks.md): selección y revisión de dependencias.
- [003/T01](../specs/003-ci-minima/tasks.md): revisión de Actions y autorización de `npm ci`.
- Estado: revisión preliminar de #1 registrada abajo; las cuatro versiones aprobadas.
  Instalación local realizada por el responsable; lockfile contrastado en la issue #3.
  Incorporar la evidencia al PR antes de habilitar instalaciones o CI.

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
