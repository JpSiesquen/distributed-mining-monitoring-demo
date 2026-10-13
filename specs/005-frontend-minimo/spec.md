# Spec 005 — Dashboard de equipos

- **Estado:** Aprobada el 2026-10-13; implementación pendiente
- **Fecha:** 2026-10-13

## Contexto

API Core ofrece equipos simulados con id/name. La spec 004 define el BFF que los expondrá
al frontend. Hace falta una interfaz que permita consultar y localizar equipos, con una
presentación cuidada y comportamiento verificable ante carga, ausencia de datos o fallos.

## Objetivo

Presentar un dashboard responsive de equipos con tarjetas, búsqueda y contador de resultados,
consumiendo exclusivamente el BFF y manteniendo el contrato id/name aprobado.

## Alcance

- Incluye: composición visual consistente, tarjetas con ID y nombre, búsqueda local,
  contador, estados de carga/vacío/error, recuperación de una consulta fallida,
  accesibilidad básica, configuración externa, compilación, pruebas y CI.
- No incluye: métricas operativas, estados inventados de maquinaria, gráficos sin fuente,
  edición de equipos, autenticación, visualización 3D, SQL, contenedores ni despliegue.

Se conserva React 19, Vite 6 y TypeScript. Versiones exactas, librerías necesarias,
comunicación local con BFF y comprobaciones de CI se concretarán en el plan. No incorporar
por anticipado todas las librerías del stack ni ampliar el contrato de datos por presentación.

Prerrequisito de integración real: BFF de la spec 004 implementado y verificado.
La planificación de 005 puede avanzar antes; no acredita esa implementación.

## Requisitos

- **R1:** consultar GET /api/equipment únicamente mediante el BFF. No llamar a API Core,
  SQL ni leer archivos del backend; la vista operativa no sustituye la fuente por mocks propios.
- **R2:** presentar cada equipo con su ID y nombre en tarjetas de jerarquía visual clara,
  dentro de una composición coherente en tipografía, espaciado, color y componentes.
- **R3:** filtrar los datos recibidos por coincidencia parcial de ID o nombre, sin distinguir
  mayúsculas/minúsculas. Mostrar el número de resultados visibles respecto del total recibido;
  vaciar la búsqueda restaura la lista, sin modificar datos ni añadir llamadas por pulsación.
- **R4:** distinguir carga inicial, lista disponible, fuente vacía, búsqueda sin coincidencias
  y error de consulta. Un fallo no se presenta como lista vacía ni como operación correcta;
  permitir reintentar y mostrar los datos al recuperarse la fuente.
- **R5:** adaptar el dashboard a móvil y escritorio sin pérdida de contenido ni desbordamiento
  horizontal de la página. Controles utilizables por teclado, foco visible, nombres accesibles,
  texto legible y mensajes que no dependan únicamente del color.
- **R6:** configurar la comunicación con BFF externamente, sin secretos en el código,
  variables públicas del frontend, bundle o .env.example. La solución de origen/proxy local
  se valida en el plan antes de modificar seguridad o configuración del BFF.
- **R7:** comprobar tipos y producir un artefacto estático para verificar la aplicación
  compilada. Las pruebas cubren filtrado, contador, estados y recuperación con datos controlados;
  la integración real verifica Frontend → BFF → API Core con datos ficticios.
- **R8:** ampliar CI para build y pruebas del frontend conservando las comprobaciones
  obligatorias de API Core/BFF. Los fallos del frontend impiden integrar. Revisar dependencias,
  Actions, comandos y protección aplicables antes de habilitar instalación o ejecución.

## Criterios de aceptación

- [ ] **CA1:** con BFF/API Core disponibles, las tarjetas muestran los mismos id/name de
  la respuesta del BFF. La inspección de red confirma que no se consulta API Core directamente.
- [ ] **CA2:** buscar por una parte de ID o nombre filtra sin distinguir mayúsculas/minúsculas.
  El contador coincide con tarjetas visibles/total recibido; limpiar búsqueda restaura todos
  los equipos y escribir no genera consultas HTTP por pulsación.
- [ ] **CA3:** fuente demorada muestra carga; arreglo vacío y búsqueda sin coincidencias
  muestran mensajes distintos. Fallo de red, respuesta no exitosa o datos inválidos muestran
  error seguro; tras recuperar la fuente y reintentar se muestran los equipos.
- [ ] **CA4:** a 360 px y 1280 px de ancho, contenido y controles son legibles y utilizables
  sin desbordamiento horizontal. Revisión visual confirma jerarquía, alineación y estados completos.
- [ ] **CA5:** búsqueda y reintento funcionan con teclado, foco visible y nombres accesibles;
  ID/nombre y mensajes permanecen comprensibles sin depender del color.
- [ ] **CA6:** configuración local y ejemplo permiten dirigir las consultas al BFF sin editar
  la lógica de la vista. No hay credenciales ni detalles internos del backend en bundle o mensajes.
- [ ] **CA7:** build comprueba tipos y produce el artefacto estático; pruebas verifican CA2/CA3
  y una expectativa incorrecta genera salida no cero. CA1–CA5 se contrastan también en la
  aplicación compilada y CA1 con BFF/API Core reales antes del cierre.
- [ ] **CA8:** CI conserva checks API Core/BFF y comprueba frontend. Un fallo controlado de
  frontend bloquea integración; recuperación verificada, sin SQL ni secretos de despliegue.

## Preguntas abiertas

- **P1 — Dirección acordada (2026-10-13):** industrial oscuro con acento ámbar, tarjetas
  sobrias, IDs monoespaciados y buen espaciado. Concretar composición y verificarla visualmente
  antes del cierre; diseño detallado en el plan.
- **P2:** definir comunicación de desarrollo y del artefacto estático con BFF, incluyendo
  origen/proxy, antes de decidir si hacen falta cambios de seguridad en el BFF.
- **P3:** seleccionar únicamente librerías necesarias y definir pruebas/CI en el plan,
  con revisión de versiones y comandos antes de instalar.

El contrato 004/P1 se conserva: búsqueda y contador se calculan con el arreglo recibido.
Cerrar 005 podrá acreditar el flujo local de 001/T02 únicamente con su evidencia completa;
no acredita integración SQL, despliegue ni aislamiento DEV/QA.
