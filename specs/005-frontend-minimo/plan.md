# Plan 005 — Dashboard de equipos

- **Spec:** [005](spec.md), aprobada el 2026-10-13
- **Estado:** En revisión; dirección visual acordada, decisiones técnicas pendientes

## Enfoque

Crear una aplicación React 19 + Vite 6 + TypeScript con una vista de equipos.
Consultar únicamente el BFF, conservar id/name y calcular búsqueda/contador en el cliente.
Estética industrial oscura con acento ámbar, aprobada el 2026-10-13.

## Diseño

### Composición visual

Cabecera con identidad del producto y título Equipos; resumen del total recibido;
barra de búsqueda con etiqueta visible; contador de resultados; cuadrícula de tarjetas.
Cada tarjeta muestra nombre como información principal e ID monoespaciado secundario.
No añadir indicadores de estado operativo ni navegación hacia vistas inexistentes.

Propuesta de detalles: fondo carbón, superficies ligeramente más claras, borde discreto,
texto claro y ámbar en acentos/foco. Tipografías del sistema, sin descargas externas.
Definir colores y espaciados compartidos en CSS; comprobar contraste al implementarlos.
Una columna en móvil y columnas adaptativas en escritorio. Nombres largos deben ajustar
líneas; priorizar el contenido a 360 px. Revisar capturas a 360 px y 1280 px antes del cierre.

Carga: tarjetas de espera con mensaje accesible. Fuente vacía: mensaje propio.
Sin coincidencias: explicar el filtro y ofrecer limpiar búsqueda. Error: mensaje genérico
y botón Reintentar; sin datos falsos ni contador que presente el fallo como cero equipos.
Controles HTML semánticos, foco visible y avisos de estado accesibles sin anuncios por pulsación.

### Archivos propuestos en frontend/

| Archivo | Responsabilidad |
|---------|-----------------|
| package.json, lockfile y .npmrc | Versiones revisadas, comandos e ignore-scripts=true. |
| tsconfig.json, vite.config.ts e index.html | Tipos, compilación, entrada y proxy local. |
| src/main.tsx y src/App.tsx | Inicialización y composición del dashboard. |
| src/equipment.ts | Contrato id/name, consulta HTTP, validación y filtrado. |
| src/EquipmentCard.tsx | Presentación de un equipo. |
| src/styles.css | Identidad, distribución responsive, foco y estados. |
| test/ | Pruebas de comportamiento y contratos. |
| README.md | Configuración, comandos y verificación local. |

Extraer otros componentes solo si mejoran la legibilidad de un caso concreto; sin router,
store global ni sistema genérico de componentes para una sola vista.

### Comunicación y configuración aprobadas el 2026-10-13

El navegador solicita /api/equipment en su mismo origen. Los servidores locales de Vite
para desarrollo y preview reenvían /api al BFF, conservando la ruta. No configurar CORS
abierto ni permitir destinos arbitrarios indicados por el navegador.

| Parámetro | Configuración local aprobada | Uso |
|-----------|-----------------|-----|
| BFF_URL | http://127.0.0.1:3001 | Variable de entorno del proxy; validar origen HTTP/HTTPS sin credenciales. |
| Escucha local | 127.0.0.1 | Desarrollo y preview, sin exposición a la red. |
| Puerto de desarrollo | 5173 | Desarrollo local. |
| Puerto de preview | 4173 | Verificación local del artefacto estático. |

Usar strictPort para fallar si el puerto está ocupado. Cargar BFF_URL solo en la configuración
de Vite; no usar prefijo VITE_ ni insertar el destino privado en el bundle. Registrar el ejemplo
en .env.example, sin credenciales. La aplicación mantiene la URL relativa al cambiar el destino.
Si falta o es inválido el destino al iniciar dev/preview, fallar con mensaje seguro.

Build produce archivos estáticos; preview verifica esos archivos y el proxy local. No es un
servidor de producción. En fase 6, Nginx asumirá la entrada de mismo origen definida en 001;
el proxy de Vite no viaja dentro de dist/. Esa configuración requerirá su propio plan.

### Estado y consulta propuestos

TanStack Query 5, seleccionado y aprobado el 2026-10-13, gestiona carga, resultado, fallo
y reintento explícito de la consulta;
useState conserva solo el texto de búsqueda. Fetch nativo comprueba estado HTTP y contrato
antes de aceptar los datos. Derivar lista visible y contador del arreglo recibido, sin estados duplicados.
Desactivar reintentos automáticos y consultas por foco/reconexión; el usuario reintenta mediante
el botón. Usar la señal de cancelación de la consulta; proponer límite de diez segundos para
que un fallo del proxy también termine, con margen sobre los cinco segundos del BFF.

Comparación parcial con normalización a minúsculas en ID/nombre, conservando el orden recibido.
No añadir debouncing ni peticiones por pulsación: la búsqueda opera sobre datos locales.

### Comandos, pruebas y CI propuestos

Dev inicia Vite; build comprueba tipos antes de generar dist/; preview sirve el artefacto local.
Test ejecuta una suite finita con salida no cero ante fallo, sin modo watch en CI.

Proponer Vitest, jsdom y React Testing Library para verificar interacción y estados del DOM;
una prueba de función pura no acredita carga, mensajes o recuperación de la pantalla.
Simular fetch en pruebas con fixtures id/name, respuestas inválidas, fallos y demoras controladas;
restaurar mocks y limpiar renders. No incorporar servidor de mocks ni navegadores descargados.
Revisión visual/teclado e integración real se realizan además en navegador con build/preview.

Añadir job frontend al workflow existente, preservando api-core y bff. Reutilizar runtime,
runner, Actions fijadas y permisos mínimos revisados; control de .npmrc antes de npm ci
--ignore-scripts, seguido de build/test. Proponer límite de cinco minutos y caché desactivada.
Validar frontend antes de exigir su check junto a los otros dos en el ruleset. Verificar un
fallo controlado que bloquee integración y su recuperación. No requerir servicios SQL o cloud.
Revisar compatibilidad, comandos, uso disponible de Actions y autorización antes de habilitarlo.

## Decisiones

- Aceptadas: contrato id/name, dashboard y estética industrial oscura con ámbar.
- Propuestas: CSS propio para esta vista; alternativa Material UI cuando haya necesidad
  concreta de componentes más complejos. No incorporar Motion, Zustand, Zod o 3D por anticipado.
- Aprobada el 2026-10-13: selección de TanStack Query para estado remoto y recuperación,
  búsqueda local y reintento por botón; sin reintentos automáticos ni consultas por foco/reconexión.
  Alternativa: fetch con estado manual añade gestión propia de ciclo de vida.
  La versión exacta y los comandos de instalación siguen pendientes de revisión y autorización.
- React/React DOM de producción; Vite, plugin React, TypeScript y tipos de desarrollo;
  TanStack Query de producción y herramientas de pruebas indicadas de desarrollo.
  Versiones exactas, compatibilidad con Vite 6/Node 24 y comandos pendientes de revisión de seguridad.
- Revisar scripts de instalación y binarios transitivos antes de ejecutar. Si ignore-scripts
  impide funcionar a un paquete, validar la causa y un comando específico; no desactivar la política.
- Comunicación local aprobada: [ADR 0011](../../docs/adr/0011-proxy-local-frontend-bff.md).
  Ampliación de CI pendiente de aprobación. Este plan no autoriza instalaciones ni cambios del ruleset.

## Respuesta a preguntas abiertas

- P1: dirección acordada; composición detallada propuesta arriba y revisión visual prevista.
- P2: resuelta; proxy de mismo origen en dev/preview y configuración local aprobados el
  2026-10-13. Nginx se concreta en fase 6.
- P3: TanStack Query seleccionado y aprobado; herramientas de pruebas y ampliación de CI
  pendientes. Versiones exactas y comandos por revisar.

## Trazabilidad

| Requisito | Solución y comprobación |
|-----------|-------------------------|
| R1 | URL relativa y proxy a BFF; inspección de red e integración real. CA1. |
| R2 | Tarjetas id/name e identidad consistente; revisión visual. CA1/CA4. |
| R3 | Filtro derivado y contador, sin llamadas por pulsación. CA2. |
| R4 | Estados distintos, validación HTTP/JSON y reintento explícito. CA3. |
| R5 | CSS responsive, HTML semántico y comprobación de teclado. CA4/CA5. |
| R6 | Destino externo del proxy sin valores privados en bundle. CA6. |
| R7 | Tipos/build, pruebas de DOM e integración compilada real. CA7. |
| R8 | Job frontend y tres checks obligatorios tras validación. CA8. |

## Riesgos

- Dependencias: aplicar [política y revisión](../../docs/seguridad-dependencias.md) antes de instalar;
  no repetir la investigación histórica. Compatibilidad y scripts siguen pendientes de revisión.
- BFF sin implementar: su disponibilidad es un prerrequisito del cierre; fixtures de pruebas no la acreditan.
- DOM simulado no acredita distribución visual: revisar navegador, tamaños y teclado por separado.
- Bundle estático no incluye el proxy: documentar diferencia entre preview local y despliegue con Nginx.
- Presentación engañosa: no inventar métricas ni confundir fuente vacía, filtro vacío y fallo HTTP.

Referencias técnicas: [proxy de Vite 6](https://v6.vite.dev/config/server-options#server-proxy),
[preview](https://v6.vite.dev/config/preview-options),
[variables de entorno](https://v6.vite.dev/guide/env-and-mode),
[configuración de Query](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults),
[entornos de Vitest](https://vitest.dev/guide/environment).
