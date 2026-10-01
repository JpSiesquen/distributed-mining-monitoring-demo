# ADR 0001 — Arquitectura en capas con BFF

- **Estado:** Aceptada
- **Fecha:** 2026-10-01

## Contexto

El sistema debe presentar información de maquinaria minera en una interfaz web, con lógica de
negocio y acceso a datos que puedan evolucionar de forma independiente de la UI, y con
componentes desplegables en servidores separados.

## Decisión

Organizar el sistema en cuatro capas, cada una comunicada solo con la adyacente:

```
Frontend → BFF → API Core → Base de datos
```

- **Frontend:** presentación. Solo conoce al BFF.
- **BFF:** adapta y agrega datos según las necesidades de la interfaz.
- **API Core:** lógica de negocio; único componente con acceso a la base de datos.
- **Base de datos:** persistencia.

## Alternativas consideradas

- **Frontend → API Core directo:** más simple, pero acopla la UI al modelo de negocio y obliga
  a exponer el API Core a internet.
- **Microservicios por dominio:** mayor aislamiento, pero complejidad operativa injustificada
  para el alcance actual.

## Consecuencias

- El API Core y la base de datos pueden permanecer en red privada; solo la capa de entrada se expone.
- La UI puede cambiar sin modificar la lógica de negocio, y viceversa.
- Se añade un salto de red y un servicio más que desplegar y monitorear.
