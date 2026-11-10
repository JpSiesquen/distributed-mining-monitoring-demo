# Tareas 010 — Orquestación y revisión especializada

- **Spec:** [010](spec.md), aprobada el 2026-11-09.
- **Plan:** [010](plan.md), aprobado el 2026-11-09.
- **Estado:** Base y T03b aprobados el 2026-11-09; T01–T03 completadas. Viabilidad T03b en curso y piloto T04–T08 pendientes.

Secuencia aprobada; inicio de T01–T02 autorizado el 2026-11-09.
No autoriza instalaciones, cambios de permisos/CI, publicación de issues/PR, merges ni
despliegues. El PDF #45 sigue pospuesto y #46 conserva su alcance pendiente.
Las casillas se cierran solo con evidencia; catálogo definido no significa agentes verificados.

## Tareas

- [x] **T01 — Documentar el protocolo de coordinación.** Crear
  `docs/orquestacion-agentes.md` con encargo mínimo, escritor único, selección de revisores,
  clasificación de hallazgos, invalidación de evidencia y límites de corrección. Enlazar
  desde AGENTS.md sin duplicar políticas ni conceder permisos.
  **Comprobar:** instrucciones distinguen coordinación, escritura y revisión; máximo dos
  subagentes simultáneos y ninguna redelegación en el piloto. Incluyen permisos heredados,
  condiciones de parada y aprobaciones humanas. **Cobertura:** R1–R5/R7/R8/R10; CA1/CA5.
  **Evidencia (2026-11-09):** protocolo creado y enlazado desde AGENTS.md; encargo mínimo,
  dos subagentes como máximo, escritor único, permisos heredados y paradas documentados.
  Referencias existentes y formato comprobados; no se delegó trabajo.

- [x] **T02 — Preparar los diez perfiles de proyecto.** Crear los TOML bajo
  `.codex/agents/` con los nombres del plan, instrucciones acotadas y referencia al protocolo.
  No fijar modelo, esfuerzo, proveedor, MCP ni ampliaciones de permisos. El implementador
  aplica las correcciones; los revisores solo devuelven resultados y el orquestador actúa
  como coordinador principal.
  **Comprobar:** diez nombres únicos; `name`, `description` y `developer_instructions`
  presentes; TOML válido con herramientas disponibles, sin instalar validadores. No declarar
  aislamiento técnico por instrucciones. Infraestructura queda reservado.
  **Depende:** T01. **Cobertura:** R1/R2/R5/R8/R10/R11; CA1/CA5.
  **Evidencia (2026-11-09):** diez TOML con nombres coincidentes con el plan, tres claves
  string requeridas y referencia al protocolo. PowerShell comprobó el subconjunto utilizado
  de cadenas literales TOML, claves/nombres y prohibición de redelegación en revisores;
  sin parser general ni paquetes nuevos. Perfiles no ignorados por Git y sin ajustes de
  modelo, permisos o MCP. Carga nativa y comportamiento no acreditados; corresponden a T03.

- [x] **T03 — Validar soporte y reglas mediante ejercicios de mesa.** Comprobar si el
  cliente carga perfiles nativos; en caso contrario, validar transmisión explícita del
  perfil en el encargo. Registrar el modo real y detenerse si no puede representarse con
  las capacidades existentes. Preparar ejemplos documentales de recomendaciones
  contradictorias, revisión invalidada por cambio de SHA, verde antiguo y job omitido.
  **Comprobar:** decisiones justificadas, evidencia anterior invalidada y omitido distinto
  de aprobado; no editar código para provocar fallos ni disparar workflows. No afirmar
  carga automática o ejecución de un rol sin evidencia. **Depende:** T02.
  **Cobertura:** R3–R6/R10/R11; CA3/CA5/CA7.
  **Evidencia (2026-11-09):** dos subagentes finalizados con perfiles transmitidos
  explícitamente y contexto mínimo; la herramienta disponible no expone selector de
  perfil. Carga nativa TOML no acreditada. Especificaciones contrastó propuestas
  contradictorias con el requisito de BFF y revisiones afectadas por un nuevo SHA.
  Se separó UTC de fixtures de una decisión de presentación/zona real aún no definida.
  CI/CD distinguió verde antiguo, test omitido, cancelación/pendiente y READY ajeno al head;
  reconoció un merge sintético válido solo con relación base/head/PR comprobada.
  Estado Git y hashes de los 17 archivos modificados/no versionados comparados quedaron
  idénticos antes y después del lote. Sin herramientas en los subagentes, ejecución de
  dependencias ni escrituras externas. Ejercicios orientados: no prueban robustez general,
  aislamiento técnico ni funcionamiento de los ocho perfiles restantes. Registro temporal
  en notas ignoradas; evidencia del piloto real aún pendiente.

- [ ] **T03b — Verificar límites técnicos antes del piloto.** Comprobar las
  opciones efectivas de solo lectura, elevaciones y herramientas remotas según el refuerzo
  propuesto en el plan. Preparar la configuración concreta y su comprobación acotada antes
  de cambiar permisos o ejecutar una prueba de escritura. Confirmar qué capacidades reciben
  los subagentes y cómo se separa la escritura posterior del informe.
  **Comprobar:** límites locales y remotos acreditados, o alternativa de evidencia local
  bajo lectura verificada. Fuentes obligatorias y evidencia por revisión en cada encargo.
  Si no es viable, registrar bloqueo y pedir decisión; no sustituir el límite por instrucciones.
  **Depende:** T03; refuerzo aprobado el 2026-11-09. **Cobertura:** R1/R5/R6/R8; CA1/CA5/CA6.
  **Viabilidad (2026-11-09):** CLI incluido en la app identificado; ayuda local confirma
  solo lectura y política never, sin iniciar modelos o cambiar configuración. La sesión
  actual no permite seleccionar permisos por subagente ni acredita bloqueo de mutaciones
  remotas. Aviso de detección de directorio personal registrado; prueba de sandbox sobre
  archivos desechables y capacidades de la futura sesión revisora aún no verificadas.
  **Prueba local (2026-11-09):** ejecución autorizada de `Test-Readonly.ps1` en notas
  ignoradas. Primer intento no concluyente por método .NET incompatible con PowerShell
  restringido; se sustituyó por cmdlets conservando perfil y rutas. Segundo intento con
  `:read-only` y requisitos administrados: lectura correcta, escritura denegada, salida 0
  y marcador ausente. Sin modelo ni conectores. No acredita restricciones de herramientas
  de una sesión de agentes; T03b permanece abierta por esa validación y controles remotos.

- [ ] **T04 — Fijar el alcance y estado inicial del piloto.** Consultar PR frontend
  #56/#57, sus bases y SHA actuales; identificar la revisión backend y contrato pertinentes.
  Comparar con los registros históricos y preparar encargos acotados. Guardar estado Git
  y hashes de cambios/archivos no versionados pertinentes en notas ignoradas.
  **Comprobar:** revisiones completas y fuentes identificadas; se conserva el trabajo local
  existente. Sin restauración/reset, lectura de secretos, cambios remotos ni ejecución de
  dependencias. Si falta acceso, registrar el límite antes de delegar.
  **Depende:** T03 y verificación de T03b. **Cobertura:** R1/R5/R6/R9/R10; CA1/CA4–CA6.

- [ ] **T05 — Revisar requisitos, calidad e integración.** Ejecutar primero la revisión
  de especificaciones; después, calidad e integración sobre la misma revisión estable,
  con un máximo de dos subagentes simultáneos. Calidad examina código y pruebas existentes;
  integración contrasta contrato, destinos y evidencia del recorrido entre repos.
  **Comprobar:** cada devolución identifica alcance, evidencia y límites; diferenciar pruebas
  leídas de ejecutadas y flujo local de publicado. No ejecutar builds/tests ni modificar
  archivos. Comparar estado/hashes después del lote y detenerse si hay cambios inesperados.
  **Depende:** T04. **Cobertura:** R1–R3/R5/R6/R9/R10; CA1/CA2/CA4–CA6.

- [ ] **T06 — Revisar CI/CD y trazabilidad documental.** Encargar por separado el contraste
  de checks y la coherencia de specs/roadmap/issues con código y evidencia. Examinar SHA,
  disparadores, etapas, reglas aplicables y metadatos de despliegues existentes disponibles.
  Consultas Vercel, si hacen falta, mantienen la skill y restricciones GET ya aprobadas.
  **Comprobar:** resultados del commit objetivo; checks omitidos/cancelados/pendientes y
  evidencia inaccesible expresos. READY no acredita integración. Documentación devuelve
  inconsistencias concretas, sin corregirlas ni publicar comentarios. Comparación Git del lote.
  **Depende:** T05. **Cobertura:** R2/R5–R7/R9–R11; CA2/CA4–CA7.

- [ ] **T07 — Revisar seguridad y consolidar hallazgos.** Ejecutar seguridad al final
  sobre los SHA fijados y resultados previos, con referencias OWASP Top 10:2025 y política
  vigente de dependencias. El orquestador consolida duplicados y contradicciones sin editar
  el código revisado. No intervienen implementador, interfaz ni infraestructura en el piloto;
  documentar sus motivos según el plan.
  **Comprobar:** riesgos aplicables con evidencia; distinguir observado, hallazgo, pendiente
  y no aplicable. Sin auditorías ofensivas, ejecución de paquetes ni garantías de ausencia
  de malware. Hallazgos aceptados/descartados con motivo/pendientes de decisión; no aplicar
  correcciones durante el piloto. **Depende:** T06. **Cobertura:** R2–R6/R8–R10; CA2–CA6.

- [ ] **T08 — Registrar evidencia y cierre del piloto.** Cerrar delegaciones, comparar
  el estado Git final y redactar un único informe en `docs/revisiones/010-piloto-integracion.md`.
  Incluir criterio, evidencia, SHA, entorno, resultado y pendiente; enlazar fuentes canónicas.
  Actualizar spec/plan/tareas/roadmap solo según resultados acreditados.
  **Comprobar:** CA1–CA7 con referencias y limitaciones; diferenciar perfiles preparados
  de roles efectivamente ejecutados. La escritura del informe corresponde al coordinador
  después de las revisiones y no modifica el código objetivo. Si hay bloqueos, mantener
  criterios abiertos y proponer el siguiente cambio por separado. No cerrar #45/#46 ni
  publicar informe, issues o PR sin autorización. **Depende:** T07.
  **Cobertura:** R1–R11; cierre de CA1–CA7 según evidencia.

## Orden de ejecución

Protocolo → perfiles → soporte y ejercicios → refuerzo técnico propuesto → estado inicial → requisitos/calidad/integración
→ CI/CD y documentación → seguridad y consolidación → informe y cierre.

Los ejercicios no sustituyen la evidencia del piloto. No se presume que PR o despliegues
sigan en su estado de octubre; cualquier cambio de revisión obliga a reevaluar la evidencia afectada.
