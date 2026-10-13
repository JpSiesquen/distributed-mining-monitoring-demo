# BFF

Base TypeScript compilable de la [spec 004](../specs/004-bff-minimo/spec.md).
Servidor, rutas, configuración operativa y pruebas HTTP pendientes. El módulo inicial
exporta el nombre del componente; no abre una escucha ni consulta API Core.

## Compilación

Node.js 24.21.0 y dependencias exactas revisadas en
[seguridad de dependencias](../docs/seguridad-dependencias.md#revisión-de-la-issue-59--bff).

Desde bff/:

```powershell
npm run build
```

Comprueba tipos y genera ES Modules JavaScript desde src/ hacia dist/.
Un error de tipos termina con salida no cero; noEmitOnError impide emitir JavaScript nuevo.
La salida anterior puede seguir en dist/: un build fallido no la acredita como actual.
dist/ y node_modules/ están ignorados por Git.

## Estado verificado

- .npmrc declara ignore-scripts=true; instalación con scripts desactivados.
- Lockfile v3: 82 paquetes, versiones e integridades coincidentes con el grafo revisado.
- Build correcto emite dist/index.js.
- Caso temporal TS2322: salida 1, sin emisión nueva y sin cambiar la salida previa;
  fuente temporal retirada y build correcto restaurado.

La CI actual verifica API Core; el job del BFF corresponde a la siguiente issue #61.
