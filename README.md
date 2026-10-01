# Distributed Mining Monitoring Demo

Demo de arquitectura distribuida para monitoreo de maquinaria minera, con frontend, BFF, API Core, base de datos, Docker y despliegue en entornos separados.

## Arquitectura

```
Frontend → BFF → API Core → Base de datos
```

| Capa | Responsabilidad | Tecnología |
|------|-----------------|------------|
| Frontend | Interfaz de monitoreo | React 19 + Vite 6 + TypeScript |
| BFF | Adaptación y agregación de datos para el frontend | Node.js + Express 4.21 + TypeScript |
| API Core | Lógica de negocio y acceso a datos | Node.js + Express 4.21 + TypeScript |
| Base de datos | Persistencia | SQL Server |

## Stack técnico

- **Lenguajes:** TypeScript 5.x, JavaScript (ES Modules), HTML5, CSS, SQL
- **Frontend:** React 19, Vite 6, TanStack Query, Zustand, React Hook Form, Zod, Material UI, Motion, Lucide React
- **Visualización 3D:** Three.js, React Three Fiber, @react-three/drei
- **Backend:** Node.js, Express 4.21, TypeScript
- **Datos:** SQL Server; repositorios mock JSON para dominios sin fuente real
- **Gestor de paquetes:** npm

## Infraestructura

- Contenedores con Docker
- Reverse proxy con Nginx
- Servicios desplegados en servidores separados
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

Las variables de entorno requeridas están documentadas en `.env.example`.

## Estado

En desarrollo.
