# Tareas 001 — Topología de despliegue

- **Spec:** [001](spec.md)
- **Plan:** [001](plan.md) — Aprobado
- **Estado:** Pendientes

Ejecutar una tarea por vez. Marcarla completada solo después de comprobar su resultado.
Las decisiones pendientes se validan al llegar a la tarea correspondiente. Esta lista no
sustituye la aprobación de instalaciones ni de recursos con costo.

## 1. Documentación del diseño

- [x] **T01 — Dibujar la topología en `docs/topologia-despliegue.md`.** Mostrar la VM DEV,
  las cuatro VMs QA, subredes, IP públicas por rol, puertos, flujos de aplicación y salto SSH.
  Usar etiquetas de rol, sin inventar IP o nombres de recursos.
  **Comprobar:** coincide con el plan y ADR 0004–0008; indica que representa el diseño objetivo.
  **Cubre:** R1–R6, R9; prepara CA8, que se verifica contra el despliegue real en T17.

## 2. Prerrequisitos de aplicación

Estas funcionalidades se definen y verifican en sus propias specs antes de desplegar.
Se construyen primero API Core, después BFF y frontend, y finalmente la integración SQL Server.
Cada componente incorpora configuración, logs, pruebas y CI según sus specs; esas comprobaciones
no se posponen hasta completar el despliegue. Si SQL local usa Docker, validar primero sus fundamentos.

- [ ] **T02 — Disponer del flujo local con datos mock.** Completar API Core con `/health`
  y `GET /api/equipment`, BFF consumiendo API Core y frontend consultando solo al BFF.
  **Comprobar:** el navegador muestra los equipos mock; el frontend no llama directamente a API Core.
  **Prepara:** el flujo que se validará en CA1/CA7; no demuestra todavía la topología desplegada.

- [ ] **T03 — Disponer de la integración con SQL Server 2022.** Antes de instalar, elegir
  ejecución local y, si usa Docker, completar sus fundamentos. Validar edición, actualización
  compatible, driver y esquema mínimo en el diseño de datos correspondiente.
  **Comprobar:** API Core consulta los equipos en SQL Server y BFF mantiene su acceso por API Core.
  **Prepara:** CA4/CA7/CA10; no instalar paquetes ni modificar el modelo sin su aprobación.

## 3. Preparación del despliegue

T04 puede resolverse después del flujo mock de T02, antes de generar imágenes; no exige tener
SQL integrado. La ejecución local de SQL se valida en T03. Completar T02/T03 y T04–T07 antes
de la fase de red y despliegue. Así no se exige Docker para SQL sin haberlo definido antes.

- [ ] **T04 — Concretar la ejecución de los servicios.** Elegir antes de generar imágenes
  o configurar servidores; puede preceder a T03. Validar el mecanismo de ejecución,
  arranque automático y persistencia, sin incorporar herramientas por anticipado.
  **Comprobar:** el procedimiento indica cómo iniciar cada componente, recuperarlo tras un
  reinicio y conservar datos/configuración. Registrar un ADR si corresponde.
  **Cubre:** R8; prepara CA7.

- [ ] **T05 — Preparar configuración externa y permisos por componente.** Documentar las
  variables reales en `.env.example`, sin secretos. BFF usa 3001 y API Core 3002; solo API Core
  recibe acceso y credenciales de SQL Server. Validar usuarios/permisos de ejecución necesarios.
  **Comprobar:** el mismo código acepta destinos locales o privados según la configuración;
  revisar que BFF no contiene conexión a SQL Server ni recibe sus credenciales.
  **Cubre:** R7, R4; CA10 se confirma en DEV desplegado en T12.

- [ ] **T06 — Preparar Nginx como entrada única.** Servir el frontend compilado y reenviar
  sus consultas al BFF. Definir cómo aplicar la configuración externa de Nginx.
  **Comprobar:** el frontend y la consulta de equipos funcionan por el mismo origen HTTP;
  Nginx no reenvía consultas directamente al API Core ni a SQL Server.
  **Cubre:** R2/R4/R7; prepara CA1.

- [ ] **T07 — Validar el inventario y presupuesto antes de crear recursos.** Concretar región,
  tamaños, discos persistentes, rangos de red sin conflictos, nombres e IP administrativa
  autorizada. Confirmar cinco VMs Ubuntu 22.04 y solo dos IP públicas, DEV y entrada QA.
  **Comprobar:** inventario aprobado, costo estimado revisado y procedimiento de desasignación
  definido; no guardar credenciales ni información personal en documentación pública.
  **Cubre:** R1/R3/R5/R9 y restricciones de cantidad/costo.

## 4. Red y despliegue

Depende de T04–T07. Cada creación o instalación se ejecuta con la aprobación correspondiente.
Aplicar las restricciones básicas antes de exponer los servicios.

- [ ] **T08 — Crear la red y su política de acceso.** Una VNet, subred DEV y subred QA,
  NSG por interfaz de VM; definir permisos específicos y rechazos con precedencia sobre los
  permisos predeterminados. Identificar excepciones operativas necesarias antes de bloquear salidas.
  **Comprobar:** matriz de reglas coincide con el plan; bloquea ambos sentidos DEV/QA y los
  saltos de aplicación en QA, incluidas rutas por IP pública. Ninguna regla abre SSH a Internet.
  **Cubre:** R3–R6; las pruebas reales se realizan en T13–T15.

- [ ] **T09 — Aprovisionar las cinco VMs con la exposición acordada.** Asociar cada VM con
  su subred, NSG y almacenamiento persistente. Solo DEV y entrada QA reciben IP pública.
  **Comprobar:** inventario efectivo coincide con T07 y el reparto 1 DEV + 4 QA; no hay servicios
  gestionados de aplicación, datos o acceso administrativo.
  **Cubre:** R1/R2/R3/R9; CA9.

- [ ] **T10 — Configurar SSH y ProxyJump.** Acceso a DEV/entrada QA desde la IP autorizada;
  acceso SSH a las tres VMs privadas desde entrada QA. Mantener claves privadas en el equipo
  administrador y limitar los destinos de salto. Definir recuperación ante bloqueo de acceso.
  **Comprobar:** acceso autorizado a cada VM; desde una IP no autorizada la conexión SSH se
  rechaza, con un control positivo que confirme que SSH está disponible.
  **Cubre:** R5; CA5.

- [ ] **T11 — Desplegar QA.** Instalar únicamente lo aprobado, aplicar el mecanismo de T04,
  configuración de T05/T06, logs y firewall del sistema. Cada componente corre en su VM y los
  servicios internos escuchan en la IP privada, sin puertos públicos adicionales.
  **Comprobar:** una consulta desde la entrada QA devuelve equipos mediante BFF → API Core
  → SQL Server; la URL HTTP devuelve el frontend.
  **Cubre:** R1–R4/R7; CA1 para QA.

- [ ] **T12 — Desplegar DEV.** Configurar los cuatro componentes en su VM, con servicios
  internos en loopback y datos/configuración separados de QA. Si hay contenedores, verificar
  su interfaz interna y el mapeo de puertos antes de publicar. Aplicar T04–T06.
  **Comprobar:** la entrada HTTP devuelve frontend y equipos; las capas se respetan en el
  código/configuración y solo API Core recibe credenciales de SQL Server.
  **Cubre:** R1/R2/R4/R7; CA1 para DEV y CA10.

## 5. Verificación de la topología

Usar conexiones nuevas. En cada prueba de bloqueo, comprobar primero que el servicio destino
está disponible desde un origen permitido. Registrar origen, destino por rol, puerto, resultado
esperado y observado en `docs/verificacion-topologia.md`, sin secretos ni IP personales.

- [ ] **T13 — Comprobar la exposición externa de ambos entornos.** Revisar interfaces de
  escucha, firewall y puertos publicados; probar desde fuera los puertos internos.
  **Comprobar:** solo Nginx acepta HTTP externo y SSH queda restringido según T10; BFF, API Core
  y SQL Server no son accesibles directamente desde fuera.
  **Cubre:** R2; CA2.

- [ ] **T14 — Comprobar los flujos de aplicación de QA.** Probar Nginx → BFF, BFF → API Core
  y API Core → SQL Server. Después probar los saltos prohibidos de la matriz del plan.
  **Comprobar:** API Core responde desde BFF, pero no desde entrada QA; SQL Server acepta una
  conexión real desde API Core, pero no desde BFF. Los demás saltos no autorizados se rechazan.
  Distinguir los puertos de aplicación del SSH administrativo permitido.
  **Cubre:** R3/R4; CA3/CA4.

- [ ] **T15 — Comprobar aislamiento DEV/QA en ambos sentidos.** Intentar conexiones nuevas
  entre entornos, usando sus direcciones privadas y las públicas cuando exista una ruta.
  **Comprobar:** ningún servidor QA alcanza servicios DEV y DEV no alcanza servicios QA,
  aun cuando esos servicios respondan desde sus orígenes permitidos.
  **Cubre:** R6; CA6.

- [ ] **T16 — Comprobar recuperación y persistencia.** Reiniciar cada VM por separado y
  probar el flujo completo después de cada reinicio. Comprobar también el caso en que API Core
  inicia antes que SQL Server y el ciclo de desasignar/encender según T07.
  **Comprobar:** los servicios se recuperan sin intervención manual y conservan datos y
  configuración; el frontend vuelve a mostrar equipos. Corregir y repetir solo las pruebas afectadas.
  **Cubre:** R8 y restricción de persistencia; CA7.

- [ ] **T17 — Ajustar documentación y cerrar la spec.** Actualizar el diagrama T01 contra el
  inventario y los flujos reales. Vincular las evidencias T09–T16 con CA1–CA10.
  **Comprobar:** el diagrama coincide con lo desplegado (CA8); todos los criterios tienen
  evidencia satisfactoria antes de marcar la spec como Implementada.
