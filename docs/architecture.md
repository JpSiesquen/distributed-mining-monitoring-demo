# Arquitectura

Sistema distribuido para monitoreo de maquinaria minera, organizado en capas desacopladas
que se despliegan de forma independiente.

## Flujo de comunicación

```
Frontend → BFF → API Core → Base de datos
```

Cada capa se comunica únicamente con la capa adyacente. El frontend nunca accede
directamente al API Core ni a la base de datos.

## Componentes

### Frontend

Interfaz web de monitoreo construida con React 19 y Vite 6. Presenta el estado de los equipos
y consume exclusivamente el BFF.

### BFF (Backend for Frontend)

Capa intermedia orientada al frontend. Adapta, agrega y simplifica las respuestas del API Core
según las necesidades de la interfaz, desacoplando la UI de la lógica de negocio.
Implementado con Node.js, Express 4.21 y TypeScript.

### API Core

Contiene la lógica de negocio y es el único componente con acceso a la base de datos.
Implementado con Node.js, Express 4.21 y TypeScript.

El acceso a datos se abstrae mediante repositorios: los dominios con fuente real (posición y
movimientos de equipos) usan SQL Server; los dominios sin fuente real usan repositorios mock JSON
con el mismo contrato, lo que permite sustituirlos sin modificar las capas superiores.

### Base de datos

SQL Server, con la información de equipos, sus posiciones, movimientos y estados.

## Decisiones de arquitectura

Las decisiones relevantes y sus alternativas están registradas en [`docs/adr/`](adr/README.md).

## Despliegue

Cada componente se contenedoriza y se despliega de forma independiente, con configuración
por entorno (DEV, QA) mediante variables de entorno.
