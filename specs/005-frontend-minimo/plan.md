# Plan 005 — Integración de Mining Ops Console

- **Spec:** [revisión 2](spec.md), aprobada el 2026-10-13.
- **Estado:** Aprobado el 2026-10-13; sustituye al plan del dashboard original.
- **Aprobado:** dos repos; lectura primero; Material UI; GET /api/events con arreglo directo;
  fechas UTC explícitas para datos ficticios y evidencia sintética de demostración.
  No autoriza instalaciones ni implementación.

## Enfoque y autoridad

Reutilizar la consola como base revisable, sin tratar su código/spec previa como autoridad
absoluta del dominio. Corregir defectos de reglas, presentación y datos cuando se identifiquen;
validar cambios de alcance antes de implementarlos.

Frontend permanece en `mining-ops-console`; API Core/BFF e infraestructura, en este repo.
No crear otra aplicación en frontend/. Cada repo conserva su historial, PR y CI.
API Core es la fuente de datos; el contrato aprobado es el acuerdo entre repos.

```text
Navegador → Vite /api → BFF /api/events → API Core /api/events → JSON ficticio
```

La primera entrega no despliega DEV/QA/PROD ni añade SQL, MQTT, polling o escrituras.
Conservar equipos id/name, health y controles existentes. Los datos del demo previo no se
copian como datos de operación; crear fixtures nuevos sin información del cliente.

## Contrato de lectura v1 aprobado

GET /api/events devuelve 200 JSON con arreglo de EventoCruce; [] representa fuente vacía.
Sin query de paginación ni envoltorio/total en esta entrega. Entregar una instantánea completa
del conjunto ficticio; frontend filtra localmente y muestra conteos de ese conjunto, no de una
operación real. Orden fuente: fechaHora descendente; empate por folio ascendente.

| Campos | Regla propuesta |
|--------|-----------------|
| folio | Texto no vacío, único en la respuesta; formato EV-AAAAMMDD-NNNN. |
| estado | conforme, revision o no_conforme. |
| categoria | null para conforme/revision; categoría activa para no_conforme. |
| confianza | Número finito entre 0 y 1. No derivar por cuenta propia la clasificación. |
| fechaHora | Fecha válida YYYY-MM-DDTHH:mm:ssZ; UTC explícita. |
| puntoCaptura, camara, versionModelo, observacion | Textos no vacíos; valores ficticios en fixtures. |
| turno | A, B o C declarado por la fuente; no inferir turnos reales desde la computadora. |
| patente, empresa | Texto no vacío o null; no inventarlos si la fuente no los aporta. |
| tipoTolva | eyectora o convencional, como catálogo propuesto sujeto a revisión de dominio. |
| evidencia | null o { imagen, boundingBoxes }; clip queda fuera del contrato inicial. |
| atencion | null o { estado, atendidoPor, fechaHora, comentario? }, solo lectura. |
| derivacion | Requerida para revision: { motivo, resolucion? }; ausente en los otros estados. |

Catálogo propuesto: sobrellenado_visual, mala_distribucion, tolva_levantada. cubre_lona no se
activa por estar en el demo. Atención: pendiente/en_seguimiento/cerrado; motivos:
polvo_en_suspension/oclusion_parcial/baja_confianza; resoluciones:
descartado/confirmado_conforme/confirmado_no_conforme. Revisar la coherencia de estas reglas
con el responsable; no añadir umbrales, métricas de seguridad ni inferencia por esta integración.

Campos desconocidos, obligatorios ausentes, tipos/rangos/fechas inválidos, folios duplicados
y combinaciones incompatibles con el contrato producen rechazo; no aceptar parcialmente una
respuesta inválida. comentario/etiqueta/resolucion opcionales se omiten, no llevan undefined en JSON.

Atención ficticia puede describir eventos ya atendidos; no equivale a sesión, autenticación
ni registro de acciones reales. Si se aporta, fechaHora debe ser UTC válida y no anterior al evento.
BoundingBoxes: x/y finitos >=0; ancho/alto >0; x+ancho e y+alto <=1; etiqueta opcional de texto.

Contrato canónico: [eventos v1](../../docs/contratos/eventos-v1.md), integrado en #93 (3de8694)
y referenciado desde frontend #36 (PR #50, merge 15afc15a). Mantener validadores explícitos de JSON y ejemplos equivalentes
por componente, sin paquete compartido/generador/Zod añadido por anticipado.

### Evidencia y fechas

Fuente aprobada el 2026-10-13: ilustraciones sintéticas identificadas como demostración,
propias del frontend bajo /evidencia/demo/, referenciadas por
rutas locales del contrato. Admitir únicamente rutas de ese catálogo, sin URLs externas,
traversal ni rutas del cliente. API Core transporta metadatos; no sirve imágenes del repo privado.
No implementar clips ni proxy de imágenes. Comprobar compatibilidad del formato elegido con
canvas/PDF antes de aceptarlo. La imagen es una ilustración de demostración, no detección real.

Preparar al menos un evento con evidencia y otro sin ella para comprobar recuadros, ausencia
explicada y PDF. Un fallo de imagen debe mostrarse en consola y reporte; no fingir evidencia.

UTC aprobada para fixtures: fechas, orden, filtros de periodo y PDF consistentes; mostrar UTC.
No reinterpretar las horas antiguas sin zona como instantes reales ni asumir zona de faena.
Adaptar domain/formato.ts y periodo.ts, incluidos límites de medianoche y periodo vacío.

### Errores y tiempos

API Core valida su fixture: error de lectura/contrato → 500 JSON genérico, sin datos internos.
BFF conserva logs por categoría y mensajes seguros: fuente inaccesible, estado no-200,
JSON/contrato inválido o redirección → 502; espera completa agotada → 504. Health independiente.
Usar API_CORE_TIMEOUT_MS existente (inicial 5000), sin cliente HTTP genérico nuevo.

Frontend usa fetch nativo con TanStack Query y validación de contrato; diez segundos para
respuesta completa combinados con cancelación de la consulta. Sin retry automático ni refetch
por foco/reconexión. En éxito inicial conservar la instantánea hasta reintento explícito; si
la consulta falla no mostrar datos anteriores como vigentes ni habilitar PDF con datos inválidos.
No reactivar sonido/popups del simulador al cargar la lista: no hay nuevos eventos en tiempo real.

## Cambios en este repositorio

| Archivo/componente | Cambio previsto |
|--------------------|-----------------|
| API Core: src/data/events.json | Fixtures completamente ficticios conformes a contrato. |
| API Core: src/routes/events.ts y validación de dominio | Leer/validar fuente y exponer GET /api/events; usar manejo seguro existente. |
| API Core: build y test | Verificar que copia data/events.json; añadir pruebas de lectura/error/contrato. |
| BFF: src/app.ts y validador de eventos | Nueva ruta independiente de equipos; validación, abort, rechazo de redirecciones y fallos seguros. |
| BFF: test | Casos correctos, vacío, inválidos, indisponible, timeout de cabeceras/cuerpo, logs/health. |
| docs/contratos, specs 002/004, README/CI/roadmap | Registrar ampliación y evidencia sin invalidar criterios ya comprobados. |

Sin dependencia nueva prevista en backend. No refactorizar rutas anteriores salvo necesidad
concreta demostrada. Conservar checks api-core/bff y sus nombres, controles y permisos.

## Cambios en mining-ops-console

| Archivo/componente | Cambio previsto |
|--------------------|-----------------|
| docs/spec.md y tasks/plan.md | Separar demo histórico de integración; referenciar contrato y este plan aprobado. |
| package.json, lockfile, .npmrc y tests | Revisar grafo actual; incorporar solo paquetes aprobados, scripts finitos y protección npm. |
| vite.config.ts y .env.example | Proxy /api al BFF_URL externo al bundle; 127.0.0.1, dev 5173/preview 4173, strictPort; sin apertura automática. |
| src/main.tsx | QueryClientProvider y ThemeProvider/CssBaseline; tema oscuro/ámbar y tipografía del sistema. |
| src/api/events.ts y domain/evento.ts | Consulta/validación del contrato; conservar vocabulario aplicable, sin duplicar estado remoto. |
| src/App.tsx y features/panel/useIngesta.ts | Datos desde Query, selección por folio; retirar seed y simulador del flujo integrado, estados y reintento. |
| PanelAlertas, Historico/Filtros | Adaptación MUI por pantalla; preservar prioridad/filtros/conteos, fuente/filtro vacío distintos. |
| DetalleEvento, EncuadreEvidencia, BadgeEstado | MUI Dialog/controles/estados; preservar foco, Escape, overlays desde datos y fallback de imagen. |
| FormularioCierre y domain/atencion.ts | Retirar invocación de tomar/cerrar del recorrido integrado; lectura con acciones deshabilitadas y explicación. |
| VistaReporte/BotonReporte | MUI para pantalla/controles; conservar import dinámico del generador PDF. |
| Portada/DocumentoReporte/config.ts | Quitar KPIS_DEMO/CRUCES_POR_JORNADA como cifras de operación; conteos del conjunto/periodo recibido, UTC y texto de datos sintéticos. |
| CSS y estilos PDF | Migrar estilos de pantallas a tema/sx; conservar CSS puntual si MUI no cubre overlays. PDF mantiene sus estilos propios: MUI no renderiza el PDF. |

No copiar flota, patentes, nombres de faena ni imágenes reales a fixtures públicos. Revisar
literales heredados y retirar detalles que no corresponden a los nuevos datos. No preservar
componentes o reglas solo porque ya existen; registrar correcciones de alcance si aparecen.

## Secuencia de PR y puertas de verificación

1. Documentos/ADR: aprobar revisión 005 y plan; reconciliar tasks/issues. ADR nuevo de repos
   separados y CI sustituye solo la ampliación frontend de ADR0010; decisión backend permanece.
   ADR0011 conserva proxy; revisar alcance /api/events sin alterar puertos/CORS automáticamente.
2. Frontend: revisar seguridad y aprobar comandos antes de cualquier build/install. Establecer
   baseline compilable, pruebas y CI inicial propias antes de migrar pantallas. Inspección visual
   del original requiere acceso autorizado; no eludir su pantalla de acceso.
3. Backend: contrato/fixtures y ruta API Core, después ruta BFF; PR pequeños con pruebas.
   Integrar proveedor compatible antes de conectar consumidor; mantener equipos/health.
4. Frontend: infraestructura Query/MUI/proxy y adquisición de datos; luego panel → histórico
   → detalle/evidencia → reporte. Revisar cada pantalla y comportamiento antes de continuar.
5. Integración: dev y build/preview con ambos servicios reales. Registrar pareja SHA y pruebas
   de caídas/recuperación, medianoche, fuente vacía, filtros y evidencia/PDF. Corregir defectos.
6. Cierre: docs de operación/compatibilidad y criterios de aceptación. Atención persistente
   necesita otra entrega aprobada; no cerrar 001/T02 sin comprobar también su vista de equipos.

## CI y pruebas previstas

- Backend: checks api-core/bff existentes, con nuevas pruebas del contrato; sin tercer job frontend aquí.
- Frontend: job frontend en su propio repo, build + pruebas Vitest/RTL/jsdom; controles npm,
  Actions oficiales fijadas a SHA revalidadas, runtime Node24.21.0, cinco minutos, permisos mínimos.
  Revalidar compatibilidad y cuotas/costos de Actions del repo privado antes de habilitarlo.
- Validar check frontend correcto/fallo de tipos/fallo de prueba/protección npm antes de exigirlo
  en su ruleset. No modificar reglas existentes ni exponer secretos sin aprobación concreta.
- Verificación de integración local con pareja SHA documentada; sin dispatch entre repos, PAT
  compartidos ni clonación autenticada de repo privado en la CI pública.
- Pruebas DOM cubren carga, vacío/filtro vacío, errores, cancelación/reintento, orden/filtros,
  acciones deshabilitadas, periodo UTC y reportes. Verificar PDF generado y navegador real
  además de mocks: comprobar contenido del documento, descarga, imágenes y limpieza de Blob.

CA1/CA2: contrato/proveedor; CA3/CA5: consulta/recuperación; CA4: dominio/reporte;
CA6: revisión visual/teclado; CA7: pareja compilada; CA8: CI; CA9: cierre documental.

## Dependencias, compatibilidad y recuperación

Conservar React19/Vite6/TypeScript y PDF existente si su revisión lo permite. Revisar Material
UI/Emotion, Query y herramientas DOM según selección anterior; no fijar nuevas versiones ni
instalar sin comandos aprobados. esbuild/fsevents aparecen con hasInstallScript: validar su
necesidad/contenido y alternativa con scripts bloqueados, sin desactivar ignore-scripts.

Cada PR identifica contrato y contraparte. Registrar SHA completo frontend/backend en evidencia,
con comandos locales reproducibles. Si falla consumidor, no integrarlo/promoverlo; volver a la
versión previamente validada sin reset/force push y mantener proveedor compatible. Git conserva
el demo anterior. Un artefacto previo solo se reutiliza si existe y está identificado; no asumirlo.

## Estado y próxima acción

Plan completo aprobado, incluidas reglas de contrato, CI por repositorio y orden de PR.
Las [tareas nuevas y sus issues](tasks.md#issues-de-ejecución) están aprobadas/publicadas;
#70–#79 quedaron sustituidas con enlaces, sin acreditar implementación. Plan integrado en PR #92.
T01/CA1 y T02–T04 completadas. Frontend PR #53 integrado en 88d5b589; CI main correcta y producción READY/alias verificados. Próxima entrega: T05 / #94 validada en PR #100 con api-core/bff verdes, pendiente integración; BFF #95 pendiente. Aviso PDF preexistente registrado para #45.
Definir recursos concretos de evidencia al implementar. Instalaciones, ejecución de CI y cambios de rulesets conservan sus
autorizaciones concretas pendientes; publicar backlog no autoriza esas operaciones.

Secuencia de evidencia aprobada el 2026-10-16: fixture inicial con evidencia: null y catálogo de producción vacío hasta T11. Validación de metadatos con catálogo aislado de pruebas; no se publican rutas sin recursos aprobados.
