# Arquitectura

Diseño objetivo del sistema distribuido de monitoreo de maquinaria minera.
Describe las responsabilidades previstas; la implementación y el despliegue están pendientes.

## Flujo de comunicación

```
Frontend → BFF → API Core → SQL Server
```

El frontend consume únicamente el BFF. El BFF llama únicamente al API Core,
que es el único servicio con acceso a SQL Server. Ninguna capa omite la siguiente.

## Componentes

### Frontend

Interfaz web prevista con React 19, Vite 6 y TypeScript. Presenta los datos de los equipos
recibidos del BFF. Las librerías de UI y visualización se incorporan cuando su funcionalidad
las requiere.

### BFF (Backend for Frontend)

Servicio previsto con Node.js, Express 4.21.x y TypeScript. Adapta o agrega respuestas del
API Core cuando lo requiere la interfaz; las transformaciones deben responder a una
necesidad concreta.

### API Core

Servicio previsto con Node.js, Express 4.21.x y TypeScript. Contiene la lógica de negocio
y concentra el acceso a datos.

El primer alcance es una comprobación de salud y una consulta de equipos simulados desde
un archivo JSON, sin conexión a SQL Server. La integración posterior usará SQL Server para
los dominios con fuente real y repositorios mock JSON para los demás, conforme al
[ADR 0002](adr/0002-sql-server-y-repositorios-mock.md).

### Base de datos

SQL Server 2022. El modelo de datos, el driver y la integración se concretarán en su
especificación antes de implementarse.

## Despliegue

La [topología aprobada](topologia-despliegue.md) utiliza cinco servidores: uno para DEV
consolidado y cuatro para QA distribuido. En QA, la entrada Nginx/frontend, el BFF,
el API Core y SQL Server se ubican en servidores distintos.

El sistema operativo elegido es Ubuntu Server 22.04 LTS. La configuración de los servicios
varía por entorno mediante variables de entorno; los secretos no se versionan.
El mecanismo de ejecución se concretará antes de preparar los artefactos y configurar los
servidores. Docker forma parte del stack previsto y se incorpora con un alcance justificado.

## Registros

- [Specs](../specs/README.md): alcance, criterios de aceptación y estado de cada entregable.
- [ADR](adr/README.md): decisiones de arquitectura aceptadas y sus consecuencias.
- [Topología](topologia-despliegue.md): distribución, comunicación y acceso administrativo.

- [Riesgo conocido de SQL Server 2022 CU27](sql-server-2022-cu27.md): condición, efecto y mitigaciones publicadas.
