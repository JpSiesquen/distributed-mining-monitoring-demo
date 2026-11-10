# Spec 010 — Orquestación y revisión especializada

- **Estado:** Aprobada por el responsable el 2026-11-09; implementación pendiente.
- **Fecha:** 2026-11-09
- **Tipo:** Mejora transversal del flujo de contribución; no añade una fase de producto.

## Contexto

El proyecto dispone de especificaciones, contratos entre dos repositorios y CI por
componente. Hace falta coordinar la implementación y su revisión independiente sin
introducir escritores concurrentes ni confundir checks individuales con integración real.

## Objetivo

Ejecutar tareas aprobadas mediante roles especializados, con un responsable del cambio,
evidencia trazable y decisiones de integración y despliegue a cargo del responsable humano.

## Alcance

- Incluye: definición de roles, delegaciones acotadas, consolidación de hallazgos,
  correcciones por un único escritor y un piloto de revisión del flujo frontend–BFF.
- No incluye: ejecución desatendida, instalaciones, nuevas conexiones MCP, cambios de
  CI o rulesets, despliegues, ampliación de permisos ni integración automática de PR.
- El PDF #45 permanece pospuesto y #46 conserva su alcance pendiente.

## Catálogo de roles acordado

Diez responsabilidades y alcance completo aprobados el 2026-11-09.

| Rol | Cuándo interviene | Responsabilidad y entregable |
|-----|-------------------|-----------------------------|
| Orquestador | Al iniciar y cerrar cada encargo. | Comprueba alcance aprobado, distribuye trabajo, resuelve dependencias y consolida evidencia para decisión humana. |
| Implementador | Ante cambios aprobados y correcciones aceptadas. | Único escritor designado; entrega diff y comprobaciones del cambio. |
| Revisor de especificaciones | Al definir requisitos o cambiar el alcance. | Detecta ambigüedades, dependencias y criterios no comprobables antes de implementar. |
| Revisor de calidad | Ante cambios de código o pruebas. | Revisa corrección, regresiones y cobertura; entrega hallazgos reproducibles. |
| Revisor de integración | Ante cambios de contrato o comunicación entre componentes. | Contrasta Frontend → BFF → API Core; entrega evidencia por repo/commit y entorno. |
| Revisor de CI/CD | Al validar un PR y después de un merge o despliegue autorizado. | Contrasta SHA, checks requeridos, etapas ejecutadas y artefacto/despliegue; informa omisiones y fallos sin operar el pipeline. |
| Revisor de documentación y trazabilidad | Antes de declarar terminada una entrega. | Contrasta código, specs, roadmap, issues y evidencia; informa inconsistencias sin duplicar registros. |
| Revisor de interfaz y accesibilidad | Ante cambios visibles o de interacción. | Revisa responsive, teclado, foco y estados en navegador real; informa resultados y limitaciones. |
| Revisor de seguridad | Antes de ejecutar dependencias y sobre el resultado final del cambio. | Revisa cadena de suministro y controles aplicables; entrega hallazgos por severidad y evidencia. |
| Revisor de infraestructura y operación | Reservado para tareas aprobadas de empaquetado, redes o despliegue. | Revisa configuración, exposición, arranque y recuperación; entrega riesgos y comprobaciones requeridas. |

El catálogo no implica diez procesos simultáneos ni activar todos los roles en cada tarea.
Infraestructura permanece reservado hasta abordar su alcance. El orquestador justifica
la selección de revisores; no se exige invocar roles sin trabajo independiente.
El orquestador puede preparar las specs y documentación; durante una delegación de
escritura no modifica los archivos asignados al implementador.

## Requisitos

- **R1:** cada delegación identifica objetivo, requisitos aprobados, repositorio y revisión
  base, archivos permitidos, restricciones, entregable y condición de finalización.
- **R2:** solo un agente escribe en el conjunto de archivos asignado en cada momento.
  Los revisores informan hallazgos sin editar, hacer commits ni publicar comentarios.
  La revisión puede ser concurrente sobre una revisión estable; las correcciones se
  consolidan y ejecutan en secuencia por el escritor designado.
- **R3:** los hallazgos incluyen archivo/línea o criterio, impacto, evidencia y forma de
  comprobarlos. El orquestador distingue hallazgos aceptados, descartados con motivo y
  pendientes; no aplica recomendaciones incompatibles sin resolver su contradicción.
- **R4:** cada corrección relevante vuelve a verificarse. La revisión de seguridad se
  realiza después de las demás correcciones; cambios posteriores que afecten su alcance
  invalidan esa revisión hasta repetir las comprobaciones afectadas. La revisión previa
  de dependencias sigue siendo obligatoria antes de instalar o ejecutar; no se pospone
  hasta la revisión final.
- **R5:** los agentes conservan las políticas existentes de dependencias, secretos,
  ejecución y Git. Las instrucciones de un rol no conceden permisos ni acreditan un
  sandbox independiente. Cualquier necesidad de aislamiento se resuelve en el plan
  antes de ejecutar; no se amplían permisos para facilitar la delegación.
- **R6:** la evidencia identifica SHA o diff revisado, comandos y resultados observados,
  entorno y limitaciones. No atribuye una prueba a un commit distinto ni presenta un
  build, health o preview READY como acreditación del recorrido completo.
- **R7:** las decisiones duraderas se registran en specs, contratos o ADR existentes;
  la evidencia resumida se incorpora al PR correspondiente al publicarlo con autorización.
  No se vuelcan conversaciones completas, secretos ni contexto personal al repositorio.
- **R8:** el responsable humano aprueba la spec y el plan antes de habilitar el flujo y
  conserva las aprobaciones exigidas por AGENTS.md. Ningún agente aprueba su propio merge
  ni convierte una aprobación de diseño en autorización de instalación o despliegue.
- **R9:** el piloto revisa la evidencia del PR frontend #57 y su relación con #56 y el
  backend, sin modificar código ni publicar. Debe separar funcionamiento local de ruta
  publicada al BFF y señalar cualquier dato histórico que requiera revalidación.
- **R10:** se delega solo cuando hay un entregable independiente y útil. Los roles
  necesarios y el límite de ejecución se explicitan en el plan, dentro del catálogo
  acordado de diez roles; no se añade infraestructura para reproducir la escala de otro equipo.
- **R11:** el revisor de CI/CD consulta resultados sin modificar workflows, reglas,
  permisos ni disparar ejecuciones por su cuenta. Comprueba el último SHA pertinente,
  jobs requeridos y etapas omitidas, canceladas o pendientes; identifica la revisión del
  artefacto o despliegue cuando exista. Un resultado verde no sustituye las comprobaciones
  de integración u operación ni autoriza un merge o despliegue.

## Criterios de aceptación

- [ ] **CA1:** responsabilidades y encargos permiten identificar quién coordina, quién
  escribe y quién revisa, sin asignaciones de escritura superpuestas.
- [ ] **CA2:** una revisión devuelve hallazgos concretos o ausencia de hallazgos con alcance
  y limitaciones; no modifica el árbol de trabajo ni escribe en GitHub.
- [ ] **CA3:** un caso con hallazgos contradictorios produce una decisión justificada antes
  de corregir; una corrección posterior invalida la evidencia afectada.
- [ ] **CA4:** el piloto entrega una tabla de criterio, evidencia, revisión y pendiente
  para el flujo frontend–BFF, sin presentar la conectividad publicada como resuelta.
- [ ] **CA5:** el registro distingue comprobaciones ejecutadas de propuestas y documenta
  que los perfiles no proporcionan por sí solos aislamiento de permisos.
- [ ] **CA6:** el piloto no instala dependencias, modifica CI, integra PR, despliega ni
  altera producción; conserva el estado de archivos ajenos a su encargo.
- [ ] **CA7:** el revisor de CI/CD distingue resultados del SHA objetivo de resultados
  anteriores, identifica checks o etapas no ejecutados y declara lo que no puede acreditar.

## Decisiones pendientes para el plan

- Formato y ubicación de los perfiles reutilizables, comprobados contra el soporte real
  de la herramienta disponible; sin fijar modelo, proveedor o costes nuevos por defecto.
- Criterios concretos de seguridad aplicables al piloto, referencias OWASP y edición
  correspondiente, sin equiparar una revisión de agente con una certificación.
- Selección de revisores y límites de ejecución del piloto; forma de comprobar la política
  de escritura única y registrar resultados sin añadir documentación redundante.

## Referencias

- [Charla de GitHub Universe](https://www.youtube.com/watch?v=-GpxKKgoWWg): transcripción
  aportada por el responsable. Arquitectura desde 09:46; controles desde 16:44; evolución
  hacia revisores que comentan y un agente que corrige en el capítulo desde 24:56.
  La transcripción menciona OWASP sin precisar Top 10 ni edición y contiene una
  contradicción en la descripción de la etapa intermedia de ejecución paralela/secuencial.
- [OpenAI: subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents):
  perfiles personalizados y herencia de permisos; consulta del 2026-11-09.
