# Plan 010 — Orquestación y revisión especializada

- **Spec:** [010](spec.md), aprobada el 2026-11-09.
- **Estado:** Base y refuerzo T03b aprobados el 2026-11-09; T01–T03 completadas. Prueba local de solo lectura verificada; T03b pendiente de capacidades de la sesión revisora y controles remotos.
- **Fecha:** 2026-11-09.

## Enfoque

Mantener un coordinador y un único escritor por encargo. Los especialistas revisan una
revisión estable y devuelven hallazgos; no corrigen ni publican por su cuenta. Usar el
catálogo de diez roles según el cambio, conservando las aprobaciones existentes.

El primer piloto es una revisión estática y de evidencia remota de PR frontend #57,
su base #56 y el backend relacionado. No implementa la conectividad pendiente ni reactiva
el PDF. Consultar primero su estado actual: los registros de octubre son evidencia
histórica, no prueba de que PR, SHA, CI o despliegues sigan iguales.

## Perfiles y soporte de ejecución

Preparar, después de aprobar plan y tareas:

- `docs/orquestacion-agentes.md`: protocolo común de encargo, escritura, hallazgos y cierre.
- `.codex/agents/<nombre>.toml`: diez perfiles de proyecto con `name`, `description` y
  `developer_instructions`; referencias al protocolo y a AGENTS.md, sin copiar sus políticas.
- AGENTS.md: enlace corto al protocolo, sin habilitar delegación ilimitada.

| Nombre | Rol de la spec |
|--------|---------------|
| `orquestador` | Orquestador |
| `implementador` | Implementador |
| `revisor_especificaciones` | Revisor de especificaciones |
| `revisor_calidad` | Revisor de calidad |
| `revisor_integracion` | Revisor de integración |
| `revisor_ci_cd` | Revisor de CI/CD |
| `revisor_documentacion` | Revisor de documentación y trazabilidad |
| `revisor_interfaz` | Revisor de interfaz y accesibilidad |
| `revisor_seguridad` | Revisor de seguridad |
| `revisor_infraestructura` | Revisor de infraestructura y operación |

Los perfiles heredan modelo y esfuerzo; no fijar proveedor, conexiones MCP, credenciales
ni permisos adicionales. El orquestador actúa en la sesión principal, sin delegarse a sí
mismo; el implementador asume también las correcciones para evitar otro escritor.

Antes de invocar perfiles, comprobar el soporte real del cliente instalado. La documentación
de OpenAI describe perfiles TOML, pero la herramienta de delegación de esta sesión recibe
un encargo, no un selector de perfil personalizado. Si no existe carga nativa verificable,
el coordinador lee el perfil y transmite explícitamente sus instrucciones en el encargo.
Registrar ese modo; no afirmar que un perfil se cargó automáticamente. No instalar ni
actualizar herramientas para resolver una incompatibilidad; detenerse si no se puede
representar fielmente el encargo con las capacidades existentes.

## Contrato de delegación

Cada encargo incluye solo:

1. Objetivo y requisitos/criterios aprobados que debe revisar.
2. Repo, SHA base y SHA objetivo completos, o identidad del diff local revisado.
3. Archivos/fuentes permitidos, exclusiones y referencias pertinentes.
4. Acciones autorizadas y prohibidas; para revisores, ninguna escritura o publicación.
5. Entregable, límite de investigación y condición de finalización.

Enviar contexto mínimo específico del encargo, sin heredar la conversación completa.
Como máximo dos subagentes simultáneos en el piloto; no crear agentes adicionales desde
los revisores. El catálogo no modifica el límite efectivo de la sesión ni garantiza costes
menores. Si un rol no aporta una revisión distinta, omitirlo y registrar el motivo.

## Escritura, permisos y correcciones

- Durante revisión no hay escritor de código activo; el coordinador tampoco altera el
  diff objetivo. Lecturas y revisión de evidencia pueden ejecutarse en paralelo.
- En tareas futuras de implementación, asignar al implementador un conjunto explícito
  de archivos. Terminar las revisiones antes de aplicar sus correcciones secuencialmente.
- Los perfiles no crean aislamiento técnico: heredan permisos de la sesión principal.
  La prohibición de escribir es una instrucción operativa, no un sandbox de solo lectura.
- El piloto no ejecuta código del repo, paquetes, builds, tests, servidores, instalaciones
  ni workflows. No lee archivos de secretos ni usa credenciales mediante variables
  transmitidas a subagentes. Las consultas remotas usan herramientas autenticadas existentes.
- Antes y después de cada lote, el coordinador compara estado Git y hashes de los archivos
  versionados modificados y archivos no versionados pertinentes. Guardar el registro temporal
  en notas ignoradas, excluyéndolas de la comparación. Si aparece una escritura inesperada,
  detenerse e informar; no restaurar, borrar ni resetear automáticamente.
- El piloto solo informa correcciones propuestas. En implementaciones posteriores se admite
  una ronda de corrección consolidada y nueva revisión afectada; si persiste un bloqueo,
  devolverlo al responsable antes de iniciar otra ronda.

## Refuerzo de permisos previo al piloto — aprobado el 2026-11-09

La sesión actual permite escritura en el workspace y utiliza revisión automática de
elevaciones; los perfiles no sustituyen esa configuración. T03 comprobó ejercicios
dirigidos y ausencia de cambios en archivos comparados, no aislamiento técnico.

Antes de T04, proponer una fase de revisión con estas condiciones verificables:

1. Permisos locales de solo lectura para los repositorios examinados y ninguna excepción
   de escritura o elevación que permita modificar esos repositorios durante la revisión.
   Verificar la política efectiva en el cliente; un nombre de perfil no basta.
2. Revisar por separado capacidades de conectores, MCP y navegador. El sandbox local no
   bloquea necesariamente sus escrituras remotas. Usar accesos técnicamente limitados a
   lectura o retirar herramientas con mutaciones de la sesión revisora. Si no puede
   verificarse esa limitación, no delegar acceso remoto: proponer un paquete de evidencia
   local obtenido por el coordinador con consultas GET, sujeto a la misma validación local.
3. Antes de cada encargo, fijar fuentes obligatorias y revisión. Exigir criterio y evidencia
   localizable en la devolución; si una fuente no se consultó, la conclusión afectada queda
   pendiente. No presentar una declaración de lectura como prueba de comprensión.
4. Validar que una escritura sobre un archivo de prueba desechable está bloqueada bajo
   la política revisora, sin probar con archivos del proyecto. Esta prueba debe autorizarse
   y acotarse al validar la configuración concreta; no ejecutarla bajo los permisos actuales.
   Contrastar además qué herramientas reales recibe un subagente y los controles de
   escalación; una prueba aislada no acredita todas las herramientas.
5. Separar la escritura del informe en una fase posterior, con delegaciones terminadas
   y autorización de escritura correspondiente. No ampliar permisos a revisores para que
   puedan guardar sus informes; devuelven texto al coordinador.

No se cambian permisos globales, credenciales, conectores o configuración administrada
mediante esta propuesta. Confirmar primero las opciones reales del cliente instalado.
Si no hay forma de cumplir el límite técnico con las capacidades existentes, registrar
la limitación y pedir una decisión antes del piloto; no volver silenciosamente al modelo
basado solo en instrucciones. La preparación de contexto y la revisión de resultados
siguen siendo necesarias incluso con aislamiento.

Referencias: [permisos y alcance de herramientas](https://learn.chatgpt.com/docs/permissions)
y [herencia de permisos en subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents),
consultadas el 2026-11-09. Incorporación y análisis de viabilidad aprobados; no se ha
configurado ni demostrado la restricción técnica.

### Viabilidad comprobada y siguiente validación

- La herramienta de delegación de esta sesión no ofrece permisos por subagente. El
  entorno actual permite escritura en workspace y dispone de herramientas remotas con
  mutaciones; no acredita una revisión técnicamente restringida.
- CLI incluido en la aplicación: `0.167.0-alpha.3.2`. Su ayuda local acepta `--sandbox
  read-only`, `--ask-for-approval never` antes de `exec`, y `exec --ignore-user-config`.
  Esto demuestra disponibilidad de opciones, no su aplicación efectiva. No se inició
  una sesión de modelo, conexión MCP o cambio de configuración.
- La ayuda produjo un aviso de detección del directorio personal, aunque Windows expone
  una ruta de usuario. La ejecución real puede fallar por ese motivo; no se ha resuelto
  ni se modifica HOME/CODEX_HOME para ocultarlo.
- Próxima validación propuesta: subcomando `sandbox` con perfil `:read-only` y requisitos
  administrados incluidos, sobre dos rutas desechables en notas ignoradas. Sin modelo ni
  acceso a servicios: leer un archivo creado por el coordinador e intentar crear un marcador.
  Debe comprobarse que la lectura funciona y que el marcador no se crea por denegación
  de permisos; errores de arranque no cuentan como bloqueo de escritura acreditado.
- Prueba concreta autorizada y ejecutada el 2026-11-09. Primer intento: PowerShell
  restringido impidió el método .NET de lectura; ese resultado no acreditó solo lectura.
  Segundo intento: misma prueba con `Get-Content`/`Set-Content`, sin ampliar permisos;
  `READ_OK`, `WRITE_DENIED`, salida 0 y marcador de escritura ausente. El aviso de directorio
  personal no se reprodujo en esa ejecución; no se modificaron variables HOME/CODEX_HOME.
  Esto acredita esas operaciones y rutas desechables bajo el subcomando sandbox, no todas
  las herramientas ni permisos de un futuro agente. Registro técnico en notas ignoradas.
- Solo después de esa prueba, concretar una ejecución revisora con apps/plugins y MCP
  no necesarios deshabilitados, sin configuración de usuario heredada y con inventario
  real de herramientas verificado. Es una alternativa pendiente de validar, no una
  configuración ya demostrada. Un paquete local de evidencia reduce la necesidad de
  conectores en los revisores; su preparación por el coordinador usa consultas autorizadas.

## Secuencia del piloto

| Paso | Responsable | Resultado esperado |
|------|-------------|--------------------|
| 1 | Orquestador | Estado Git inicial; PR #56/#57 actuales, bases y SHA completos; backend compatible y fuentes disponibles. Si cambiaron, revisar el estado real y explicar la diferencia. |
| 2 | Especificaciones | Contrato y criterios aplicables a consulta, errores, entorno y cierre; ambigüedades concretas. |
| 3 | Calidad + integración | Revisiones separadas sobre la misma revisión: código/pruebas por una parte, recorrido y contrato entre repos por otra. |
| 4 | CI/CD + documentación | Checks y etapas para el SHA objetivo; correspondencia de estados documentales con la evidencia. |
| 5 | Seguridad | Revisión final de los SHA fijados y hallazgos consolidados, sin editar. |
| 6 | Orquestador | Tabla por criterio con evidencia, SHA, entorno, resultado y pendiente; decisiones sobre hallazgos; comparación Git final. |

Implementador no interviene porque el piloto no modifica código. Interfaz se omite como
ejecución nueva: el acceso al navegador falló en esta sesión; la evidencia visual anterior
se identifica como histórica. Infraestructura permanece reservado. No crear revisiones
ficticias ni considerar aprobado lo que no se pudo observar.

## Revisión de CI/CD

Consultar ejecuciones y configuración vigentes sin reejecutar jobs ni cambiar reglas:

- Distinguir CI de PR, CI posterior al merge, preview y producción.
- Contrastar `head SHA`, base del PR, workflow, checks requeridos y conclusión de cada job.
- Examinar etapas de instalación, build y test; un job omitido/cancelado no equivale a una
  prueba ejecutada. No asumir que un check requerido para main protege todas las ramas.
- Para despliegues existentes, contrastar commit, destino y evidencia de funcionamiento;
  READY o un alias por sí solos no prueban comunicación con BFF.
- Si no hay acceso a logs, reglas o metadatos, marcar la comprobación pendiente. Las
  consultas Vercel, si fueran necesarias, siguen la skill y restricciones GET ya aprobadas;
  no instalar ni actualizar el CLI.

## Seguridad aplicable

Usar [OWASP Top 10:2025](https://top10.owasp.org/2025/) como referencia de riesgos y la
[política vigente de dependencias](../../docs/seguridad-dependencias.md) como control de
ejecución. OWASP Top 10 no es una auditoría exhaustiva ni certificación.

| Riesgo | Alcance de revisión del piloto |
|--------|--------------------------------|
| A01/A07: acceso y autenticación | Identificar límites de acceso y lo que la integración no implementa; no añadir autenticación ni probar credenciales. |
| A02/A04: configuración y criptografía | Revisar destinos configurados, exposición prevista y tratamiento de secretos; el despliegue/TLS no observado queda pendiente. |
| A03/A08: cadena de suministro e integridad | Contrastar manifiestos/lockfiles, revisiones documentadas, scripts bloqueados y Actions fijadas; no ejecutar paquetes ni afirmar ausencia de malware. |
| A05/A06: inyección y diseño | Revisar validación de datos, rutas de evidencia permitidas y separación entre capas. |
| A09/A10: logs y excepciones | Revisar errores genéricos, ausencia de secretos en logs, timeout y recuperación previstos. |

Marcar cada comprobación como observada, hallazgo, pendiente o no aplicable con motivo.
No introducir pruebas ofensivas ni controles nuevos mediante esta revisión. La revisión
previa a ejecución de dependencias se mantiene antes de cualquier ejecución futura.

## Hallazgos y evidencia

Cada especialista entrega resumen, alcance/SHA, hallazgos con severidad e impacto,
archivo/línea o criterio, evidencia y comprobación propuesta; separa limitaciones.
Un resultado sin hallazgos solo vale para ese alcance y revisión.

El orquestador consolida duplicados y registra cada hallazgo como aceptado, descartado
con motivo o pendiente de decisión. Distinguir prioridad del defecto de completitud del
criterio: un pendiente sin acceso no se convierte automáticamente en vulnerabilidad.
Cuando haya contradicción de contrato o alcance, escalar la decisión sin modificar código.

Guardar un único informe técnico en `docs/revisiones/010-piloto-integracion.md` al finalizar
el piloto. Notas intermedias quedan ignoradas. El coordinador escribe ese informe solo
después de cerrar las delegaciones; incluir limitaciones, no volcados de chat o datos personales.
Su publicación, cualquier issue y los merges se revisan aparte; no hay escrituras externas
durante el piloto.

## Validación y trazabilidad

| Requisitos / criterios | Comprobación prevista |
|-----------------------|-----------------------|
| R1/R10; CA1 | Revisar diez perfiles y encargos; máximo dos subagentes y un escritor designado. |
| R2/R5/R8; CA2/CA5/CA6 | Comparar estado/hashes antes y después; registrar permisos heredados y ausencia de escrituras remotas, instalaciones o despliegues. |
| R3/R4; CA3 | Ejercicio de mesa con dos recomendaciones contradictorias y un cambio de revisión: resolver o escalar antes de corregir; invalidar evidencia anterior. No introducir defectos en el repo. |
| R6/R9; CA4 | Informe por criterio/SHA/entorno, separando localhost, preview y producción. |
| R7; CA5 | Informe único y enlaces a documentos canónicos; sin duplicar fuentes de verdad. |
| R11; CA7 | Comparar SHA objetivo y ejecución; comprobar un ejemplo documental de job omitido y otro de verde antiguo, sin generar fallos remotos. |

## Riesgos y límites

- Contexto excesivo: encargos acotados y respuestas breves, con evidencia localizable.
- Conflictos o cambios de revisión: revisión estable, escritor único e invalidación explícita.
- Falsa independencia: registrar que todos pueden heredar el mismo modelo y permisos;
  varios revisores no garantizan diversidad ni corrección.
- Registros desactualizados o fuentes inaccesibles: consultar estado actual y declarar pendientes.
- Divergencia Git local: conservar commits y cambios existentes; no reset/rebase/force.
  Antes de publicar, elegir y revisar una base compatible en un paso independiente.

## Referencias y siguientes pasos

- [OpenAI: subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents),
  consultado el 2026-11-09: perfiles TOML y permisos heredados; no garantizan solo lectura.
- [OWASP Top 10:2025](https://top10.owasp.org/2025/), consultado el 2026-11-09.
- Plan y [tareas](tasks.md) aprobados; protocolo y perfiles preparados localmente en T01–T02.
  T03 verificada mediante transmisión explícita de dos perfiles y ejercicios sintéticos,
  sin acreditar carga nativa. Refuerzo aprobado y prueba local acotada correcta; siguiente
  paso: concretar y verificar capacidades de la sesión revisora y límites remotos antes de T04.
