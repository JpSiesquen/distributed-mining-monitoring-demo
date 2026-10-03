# AGENTS.md

Guía de contribución para agentes de IA y colaboradores que trabajen en este repositorio.

## Contexto del proyecto

Sistema distribuido de monitoreo de maquinaria minera, diseñado con servicios desacoplados,
contenedores y despliegue en entornos separados.

## Arquitectura

```
Frontend → BFF → API Core → Base de datos
```

- **Frontend**: interfaz de usuario. Solo se comunica con el BFF.
- **BFF (Backend for Frontend)**: adapta y agrega datos para el frontend. Solo se comunica con el API Core.
- **API Core**: lógica de negocio y único servicio con acceso a la base de datos.
- **Base de datos**: SQL Server.

Ninguna capa debe saltarse a la siguiente.

## Stack

| Área | Tecnología |
|------|------------|
| Lenguajes | TypeScript 5.x, JavaScript (ES Modules), HTML5, CSS, SQL |
| Frontend | React 19 + Vite 6 |
| Estado remoto y UI | TanStack Query, Zustand, React Hook Form, Zod, Material UI, Motion, Lucide React |
| Visualización 3D | Three.js, React Three Fiber, @react-three/drei |
| BFF y API Core | Node.js + Express 4.21.x + TypeScript |
| Acceso a datos | Driver de SQL Server en API Core; repositorios mock JSON para dominios sin fuente real |
| Gestor de paquetes | npm (`package-lock.json`, lockfileVersion 3) |
| Infraestructura | Docker, Nginx, GitHub Actions, Azure |

Las librerías se incorporan cuando la funcionalidad que cubren se implementa, no por anticipado.

## Principios de ingeniería

1. Cambios pequeños, incrementales y verificables.
2. Simplicidad antes que complejidad.
3. No incorporar nuevas tecnologías o dependencias sin una necesidad justificada.
4. Mantener la separación de responsabilidades entre capas.
5. Documentar en `docs/` las decisiones de arquitectura relevantes.

## Flujo de trabajo

Al retomar, leer `docs/roadmap.md` para identificar el punto actual y la próxima acción;
abrir después solo las specs y ADR necesarios para ese paso.

Las funcionalidades relevantes siguen un flujo guiado por especificaciones (ver `specs/README.md`):
`spec.md` (qué y por qué) → `plan.md` (cómo) → `tasks.md` (pasos) → implementación.

- No implementar una funcionalidad relevante sin spec aprobada.
- Validar cada tarea contra los criterios de aceptación de su spec.
- Si la implementación cambia el alcance, actualizar la spec en el mismo cambio.
- Las decisiones de arquitectura derivadas de un plan se registran como ADR en `docs/adr/`.

## Control de la sobreingeniería

Cada pieza de complejidad debe responder a un requisito actual, no a uno hipotético.

- Implementar la solución más simple que cumpla el requisito (KISS).
- No construir funcionalidad por anticipado (YAGNI).
- No introducir abstracciones, capas o patrones hasta que exista un caso concreto que los justifique.
- Preferir código explícito y legible sobre soluciones genéricas o "inteligentes".
- Evitar configuraciones, flags o puntos de extensión sin uso real.
- Si una solución requiere justificar su complejidad, documentar el motivo en `docs/`.

Fuera de alcance salvo necesidad demostrada y validada:

- Kubernetes u otros orquestadores
- Terraform u otras herramientas de infraestructura como código
- Brokers de mensajería (Kafka, RabbitMQ)
- Service mesh
- Arquitectura hexagonal u otros patrones de capas adicionales
- Descomposición en microservicios más allá de los componentes definidos
- Despliegue multi-cloud
- Automatización de infraestructura por encima de lo que exige el despliegue

## Seguridad y gestión de secretos

- Toda configuración sensible se gestiona mediante variables de entorno.
- Mantener `.env.example` actualizado con cada nueva variable, sin valores reales.
- Nunca mostrar, copiar, registrar en logs, versionar ni insertar en código: tokens,
  contraseñas, claves privadas, credenciales de Azure, PAT de GitHub o secretos similares.

## Política de dependencias y ejecución

Las dependencias externas se consideran un riesgo de cadena de suministro.

No instalar, actualizar ni eliminar paquetes, dependencias, herramientas, extensiones,
runtimes o software sin aprobación explícita del responsable del proyecto. Esto incluye:

```
npm install / npm update / npm ci
npx <paquete-no-instalado>
pnpm add / yarn add
pip install
winget install / choco install
docker pull
curl ... | bash
scripts de PowerShell descargados de Internet
```

Toda propuesta de instalación debe indicar:

1. Nombre exacto del paquete.
2. Motivo por el que se necesita.
3. Tipo de dependencia: producción o desarrollo.
4. Comando exacto que se ejecutará.

Criterios de evaluación de paquetes:

- Evitar dependencias que solo aporten comodidad si la funcionalidad puede resolverse
  razonablemente con herramientas ya disponibles.
- Revisar `package.json` antes de añadir dependencias, para evitar duplicados o paquetes innecesarios.
- Preferir paquetes ampliamente adoptados y con mantenimiento activo.
- Cuando corresponda, verificar mantenedor, repositorio oficial, fecha de publicación,
  versiones recientes e incidentes de seguridad conocidos.
- Revisar los scripts de ciclo de vida (`preinstall`, `install`, `postinstall`, `prepare`)
  y no ejecutar scripts sospechosos ni scripts obtenidos de Internet.

## Git

Revisar el estado antes de cada commit:

```
git status
git diff
```

Requieren aprobación explícita:

- `git push --force`
- `git reset --hard`
- Eliminaciones masivas de archivos
- Cualquier operación destructiva o que reescriba el historial

## Decisiones que requieren validación

Antes de implementar, proponer alternativas y validar con el responsable del proyecto
cualquier cambio que afecte a:

- Arquitectura o incorporación de nuevos servicios
- Infraestructura, redes o proveedor cloud
- Base de datos o modelo de datos
- Seguridad
- Contenedores, CI/CD o monitoreo
- Dependencias principales o cambios de stack
- Refactorizaciones amplias
- Costos
- Entornos DEV / QA / PROD

## Supuestos no permitidos

Si falta información, consultar antes de asumir. No inventar credenciales, direcciones IP,
puertos, nombres de servicios, configuraciones, versiones ni decisiones de arquitectura.

Ante la duda entre automatizar una acción o consultarla, consultar.
La seguridad tiene prioridad sobre la velocidad.
