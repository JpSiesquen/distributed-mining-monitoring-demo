# Tareas 005 — Dashboard de equipos

- **Spec:** [005](spec.md)
- **Plan:** [005](plan.md), aprobado el 2026-10-13
- **Estado:** En revisión; pendientes de ejecución

La integración real requiere BFF de la spec 004 implementado y verificado. Las pruebas con
fixtures no cumplen ese prerrequisito. Instalar cada dependencia al abordar su funcionalidad,
con revisión y comandos aprobados; las casillas representan ejecución verificada.

- [ ] **T01 — Revisar y autorizar dependencias.** Seleccionar versiones exactas compatibles
  de React 19/React DOM, Vite 6/plugin React, TypeScript/tipos, TanStack Query, Material UI/Emotion
  y Vitest/jsdom/React Testing Library. Revisar procedencia, avisos y scripts directos/transitivos.
  Registrar finalidad, tipo y comandos exactos antes de instalar; validar los binarios necesarios
  sin desactivar ignore-scripts.
  **Comprobar:** revisión y aprobaciones registradas en seguridad de dependencias; sin librerías
  ajenas al alcance ni secretos en el entorno de ejecución. Prerrequisito de T02; R8.

- [ ] **T02 — Preparar frontend compilable.** Crear proyecto React/TypeScript ES Modules,
  .npmrc, lockfile v3, entrada HTML y configuración de tipos/build. Instalar solo lo autorizado
  y contrastar el lockfile; no usar generadores que descarguen paquetes sin aprobación.
  **Comprobar:** ignore-scripts efectivo; build comprueba tipos y genera dist/. Un error de
  tipos produce salida no cero antes del empaquetado. R7; prepara CA7.

- [ ] **T03 — Incorporar CI inicial del frontend.** Tras T02, revalidar Actions, comandos,
  compatibilidad y uso disponible; añadir job frontend de build con controles npm, permisos
  mínimos, cinco minutos y caché desactivada. Conservar api-core/bff y exigir frontend solo
  después de validar su ejecución, dentro de esta entrega.
  **Comprobar:** tres checks pasan con build válido; error de tipos frontend bloquea integración
  mientras los otros componentes pasan. Política npm comprobada antes de instalar. R8/CA8 parcial.

- [ ] **T04 — Construir la composición visual.** Incorporar Material UI/Emotion revisados,
  tema industrial oscuro/ámbar, tipografía del sistema, cabecera, tarjetas id/name, búsqueda
  etiquetada, contador y componentes para carga/vacío/error. Sin indicadores operativos inventados.
  **Comprobar:** composición a 360/1280 px, foco visible y nombres largos sin desbordamiento;
  tarjetas y estados revisables con fixtures exclusivos de prueba. Sin mocks en la vista operativa.
  Depende de T02/T03; R2/R5; prepara CA4/CA5.

- [ ] **T05 — Consultar al BFF y gestionar estados.** Configurar proxy /api en dev/preview
  mediante BFF_URL validado, escucha local y strictPort. Actualizar .env.example y conectar
  TanStack Query/fetch con validación HTTP/contrato, espera completa de diez segundos y cancelación.
  Distinguir carga, fuente vacía y fallo; incorporar reintento por botón sin reintentos automáticos
  ni consultas por foco/reconexión.
  **Comprobar:** origen/destino se aplican sin editar la vista; no CORS abierto ni destino privado
  en bundle. Fallo/JSON inválido/demora producen error seguro; recuperar fuente y reintentar muestra
  datos. Con BFF real, verificar id/name y red sin acceso directo a API Core.
  Depende de T04 y de 004 para integración real; R1/R4/R6; CA1/CA3/CA6.

- [ ] **T06 — Incorporar búsqueda y contador.** Filtrar el arreglo recibido por ID/nombre
  con coincidencia parcial sin distinguir mayúsculas/minúsculas. Derivar contador visible/total;
  limpiar búsqueda restaura la lista. Diferenciar fuente vacía y filtro sin coincidencias.
  **Comprobar:** tarjetas/contador coinciden con los datos; escribir no genera peticiones por
  pulsación ni altera el arreglo. Depende de T05; R3/R4; CA2 y parte de CA3.

- [ ] **T07 — Automatizar interacción y fallos.** Añadir herramientas de pruebas autorizadas
  y suite finita sobre el DOM. Verificar búsqueda, contador, carga, fuente vacía, filtro vacío,
  errores HTTP/JSON/contrato, timeout y recuperación por botón con fetch controlado.
  Restaurar mocks, temporizadores y renders; comprobar cancelación y ausencia de consultas
  por pulsación/foco/reconexión. No descargar navegadores ni incorporar servidor de mocks.
  **Comprobar:** npm test pasa; expectativa incorrecta produce salida no cero, sin recursos
  pendientes. Simulación DOM no sustituye revisión visual ni integración real.
  Depende de T06; R7; CA2/CA3/CA7.

- [ ] **T08 — Validar pruebas y bloqueo en CI.** Añadir test al job frontend y contrastar
  tres checks obligatorios. Usar un cambio temporal de expectativa para verificar fallo sin
  integrarlo; restaurar y enlazar ejecución correcta.
  **Comprobar:** instalación/build/test pasan; fallo frontend bloquea integración con api-core/bff
  correctos. Control npm falla antes de instalar si falta protección y los pasos siguientes no
  continúan tras un fallo. Sin SQL ni credenciales de despliegue.
  Depende de T03/T07; R8/CA8.

- [ ] **T09 — Verificar diseño y flujo compilado.** Revisar en navegador real dev y
  build/preview con BFF/API Core reales; inspeccionar red. A 360/1280 px comprobar distribución,
  contraste, nombres largos, estados completos y uso por teclado. Corregir defectos observados
  y registrar capturas/evidencia sin datos sensibles.
  **Comprobar:** CA1–CA6 en el artefacto estático; carga, errores y recuperación no se confunden
  con listas vacías. La UI solo consulta BFF. No acreditar esto con DOM simulado.
  Depende de T05–T08 y de 004 verificada; R1–R7; CA1–CA7.

- [ ] **T10 — Documentar operación y cierre.** Redactar frontend/README.md con configuración,
  comandos, rutas, diagnóstico y diferencia entre preview y producción. Actualizar docs/ci.md,
  roadmap y estados, enlazando evidencia por criterio.
  **Comprobar:** CA1–CA8 acreditados antes de marcar 005 implementada; comandos/configuración
  coinciden con código y CI. Revisar 001/T02 solo con evidencia completa del flujo local;
  no acreditar SQL, despliegue o aislamiento DEV/QA. Depende de T09; todos los requisitos.
