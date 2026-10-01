# Distributed Mining Monitoring Demo

Demo de arquitectura distribuida para monitoreo de maquinaria minera, con frontend, BFF, API Core, base de datos, Docker y despliegue en entornos separados.

## Arquitectura

```
Frontend → BFF → API Core → Base de datos
```

| Capa | Responsabilidad | Tecnología |
|------|-----------------|------------|
| Frontend | Interfaz de monitoreo | React + Vite + TypeScript |
| BFF | Adaptación y agregación de datos para el frontend | Node.js + Express + TypeScript |
| API Core | Lógica de negocio y acceso a datos | Node.js + Express + TypeScript |
| Base de datos | Persistencia | SQL |

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
├─ docs/        # Documentación técnica
└─ README.md
```

## Configuración

Las variables de entorno requeridas están documentadas en `.env.example`.

## Estado

En desarrollo.
