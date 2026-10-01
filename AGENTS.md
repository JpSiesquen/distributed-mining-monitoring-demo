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
- **Base de datos**: almacenamiento relacional SQL.

Ninguna capa debe saltarse a la siguiente.

## Stack

- React + Vite + TypeScript
- Node.js + Express + TypeScript
- SQL
- Docker
- Nginx
- GitHub Actions
- Azure

## Principios de ingeniería

1. Cambios pequeños, incrementales y verificables.
2. Simplicidad antes que complejidad; evitar sobreingeniería.
3. No incorporar nuevas tecnologías o dependencias sin una necesidad justificada.
4. Mantener la separación de responsabilidades entre capas.
5. Documentar en `docs/` las decisiones de arquitectura relevantes.

## Seguridad y configuración

- No incluir credenciales, tokens, contraseñas ni secretos en el repositorio.
- Toda configuración sensible se gestiona mediante variables de entorno.
- Mantener `.env.example` actualizado con cada nueva variable, sin valores reales.

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
