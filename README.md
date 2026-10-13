# Distributed Mining Monitoring Demo

Demo de arquitectura distribuida para monitoreo de maquinaria minera, con frontend, BFF, API Core, base de datos, Docker y despliegue en entornos separados.

## Arquitectura

```
Frontend → BFF → API Core → Base de datos
```

| Capa | Responsabilidad | Tecnología |
|------|-----------------|------------|
| Frontend | Interfaz de monitoreo | React 19 + Vite 6 + TypeScript |
| BFF | Adaptación y agregación de datos para el frontend | Node.js + Express 4.22.3 + TypeScript |
| API Core | Lógica de negocio y acceso a datos | Node.js + Express 4.22.3 + TypeScript |
| Base de datos | Persistencia | SQL Server |

## Stack técnico

- **Lenguajes:** TypeScript 5.x, JavaScript (ES Modules), HTML5, CSS, SQL
- **Frontend:** React 19, Vite 6, TanStack Query, Zustand, React Hook Form, Zod, Material UI, Motion, Lucide React
- **Visualización 3D:** Three.js, React Three Fiber, @react-three/drei
- **Backend:** Node.js, Express 4, TypeScript; Express 4.22.3 aprobado para API Core
- **Datos:** SQL Server; repositorios mock JSON para dominios sin fuente real
- **Gestor de paquetes:** npm

## Infraestructura prevista

- Contenedores con Docker
- Reverse proxy con Nginx
- DEV consolidado en un servidor; QA distribuido en cuatro servidores
- Entornos DEV y QA
- CI/CD con GitHub Actions
- Despliegue en Azure

## Estructura del repositorio

```
distributed-mining-monitoring-demo/
├─ frontend/    # Aplicación React
├─ bff/         # Backend for Frontend
├─ api-core/    # API principal
├─ docs/        # Documentación técnica y ADR
├─ specs/       # Especificaciones por funcionalidad
└─ README.md
```

## Configuración

Las variables de entorno se documentarán en `.env.example` al incorporar la configuración
de cada componente, sin valores sensibles.

## Estado

API Core implementa salud, equipos simulados, errores JSON y seis pruebas de contrato.
La [CI verificada](docs/ci.md) comprueba API Core y compilación del BFF;
`main` exige pull request y checks api-core/bff exitosos.
La [operación de API Core](api-core/README.md) está documentada y la spec 002 verificada.
BFF cuenta con [arranque, salud y equipos vía API Core verificados](bff/README.md),
con errores seguros y CI de compilación. Suite HTTP y CI de pruebas pendientes.
Frontend, integración de base de datos y despliegue pendientes. La topología está aprobada.
Los estados de cada entregable se registran en el [índice de specs](specs/README.md).

Continuar desde el [roadmap técnico](docs/roadmap.md). Consultar el
[diseño de arquitectura](docs/architecture.md) y la
[topología de despliegue](docs/topologia-despliegue.md).
