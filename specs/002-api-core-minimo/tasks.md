# Tareas 002 — API Core mínimo con equipos simulados

- **Spec:** [002](spec.md)
- **Plan:** [002](plan.md) — Aprobado
- **Estado:** Pendientes

Completar una tarea por vez y marcarla solo después de su comprobación. Las instalaciones
requieren aprobación explícita, independiente de la aprobación de esta lista.

- [ ] **T01 — Validar dependencias exactas.** Revisar lo disponible y evaluar Express 4.21.x,
  TypeScript 5.x y los tipos necesarios, sin añadir un ejecutor TypeScript ni otras librerías.
  Proponer paquete, versión, motivo, producción/desarrollo y comando exacto de instalación.
  **Comprobar:** la selección respeta el stack y cada instalación tiene aprobación antes de ejecutarse.
  **Prepara:** todas las tareas siguientes.

- [ ] **T02 — Preparar el proyecto y la compilación.** Crear package.json con ES Modules y
  tsconfig.json para generar JavaScript en dist/, sin emitir ante errores de tipos. Instalar
  únicamente las dependencias aprobadas en T01 y generar el lockfile npm.
  **Comprobar:** un archivo mínimo se compila a dist/; un error de tipos impide completar build.
  No crear capas adicionales ni modificar BFF/frontend.
  **Cubre:** R6; prepara CA6.

- [ ] **T03 — Configurar el arranque local.** Crear server.ts y la aplicación Express en app.ts.
  Leer API_CORE_HOST y API_CORE_PORT desde el entorno; documentarlos en el .env.example de la
  raíz y mantener .env ignorado. Configuración local: loopback y puerto 3002.
  **Comprobar:** la escucha corresponde a 127.0.0.1:3002; cambiar el puerto y reiniciar mueve
  la escucha sin editar código. Un puerto inválido u ocupado produce fallo de arranque explícito.
  **Cubre:** R4; CA4.

- [ ] **T04 — Añadir GET /health.** Responder HTTP 200 con JSON de estado del servicio.
  **Comprobar:** `curl.exe -i http://127.0.0.1:3002/health` devuelve 200 y el estado ok;
  funciona sin SQL Server ni credenciales de base de datos.
  **Cubre:** R1/R3; CA1 y parte de CA3.

- [ ] **T05 — Añadir equipos mock y su ruta.** Crear data/equipment.json con equipos ficticios,
  id/name de texto e identificadores distintos. Registrar routes/equipment.ts desde app.ts,
  leer el JSON mediante una ruta relativa al módulo y devolver su arreglo.
  **Comprobar:** `curl.exe -i http://127.0.0.1:3002/api/equipment` devuelve 200 JSON con los
  mismos equipos del archivo y solo id/name, sin depender de SQL Server.
  **Cubre:** R2/R3; CA2/CA3.

- [ ] **T06 — Completar respuestas 404 y 500.** Registrar el manejador 404 después de las rutas
  y el manejador 500 al final; capturar errores asíncronos de lectura para entregarlos a Express 4.
  **Comprobar:** una ruta inexistente devuelve 404 JSON. Renombrar temporalmente el mock en
  una prueba controlada provoca 500 JSON sin rutas internas ni detalles sensibles; /health
  sigue respondiendo. Restaurar el archivo y verificar que el listado vuelve a funcionar.
  **Cubre:** R5; CA5.

- [ ] **T07 — Completar build/start/dev y el archivo de datos compilado.** Build comprueba tipos,
  genera JavaScript y copia el mock a dist/data/ con herramientas disponibles de Node.js.
  Start ejecuta dist/server.js; dev ejecuta build y solo después de su éxito ejecuta start.
  **Comprobar:** npm run dev funciona; detenerlo y ejecutar npm run build seguido de npm start
  también funciona. En ambos modos, repetir las consultas de T04/T05. Si build falla por un
  error de tipos, dev no arranca una compilación anterior. Verificar dist/data/equipment.json.
  **Cubre:** R6; CA6.

- [ ] **T08 — Documentar ejecución y configuración.** Añadir un README breve en api-core/ con
  requisitos, configuración local, comandos y respuestas esperadas. Explicar que /health no
  demuestra disponibilidad de datos y que dev requiere reiniciar después de cambiar código.
  **Comprobar:** el procedimiento coincide con package.json y .env.example y permite repetir
  CA1/CA2 en ambos modos; los ejemplos no contienen secretos ni fuentes reales.
  **Cubre:** R1/R4/R6.

- [ ] **T09 — Verificar y cerrar la spec.** Repetir únicamente las comprobaciones pendientes
  o afectadas por cambios, y registrar evidencia de CA1–CA6 en la spec: comandos, códigos HTTP
  y resultado observado, sin secretos. Confirmar que no se añadió acceso SQL ni infraestructura.
  **Comprobar:** todos los criterios cumplen el resultado esperado antes de marcarlos y cambiar
  el estado a Implementada. No dar por completa T02 de la spec 001: aún necesita BFF y frontend.
