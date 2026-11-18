# Cierre del piloto de revisión especializada

Piloto de la [spec 010](../../specs/010-orquestacion-agentes/spec.md) completado el 2026-11-18. El alcance fue revisar una integración frontend–BFF sobre revisiones fijadas. Se prepararon diez perfiles y se ejecutaron seis encargos de revisión en sesiones independientes, con un máximo de dos en paralelo.

## Resultados

| Criterio | Evidencia del piloto | Límite |
| --- | --- | --- |
| CA1 · Responsabilidades | El coordinador fijó el alcance y preparó evidencia por rol. Especificaciones, Calidad, Integración, CI/CD, Documentación y Seguridad devolvieron observaciones. El coordinador redactó el cierre. | La carga automática de perfiles sigue pendiente de acreditación. |
| CA2 · Hallazgos trazables | Las devoluciones identificaron revisión, fuentes, observaciones y límites. Se contrastaron con los documentos y el código examinado. | Cada devolución cubre las fuentes de su encargo. |
| CA3 · Conflictos de revisión | Un ejercicio con recomendaciones contradictorias dio lugar a una decisión justificada. Otro comprobó cuándo un cambio de revisión invalida evidencia previa. | Los escenarios de conflicto y cambio de revisión se evaluaron con datos ficticios. |
| CA4 · Integración | Se distinguió la inspección estática, la evidencia histórica local y el estado reportado por la plataforma de despliegue. | La conectividad de la aplicación desplegada requiere una comprobación posterior. |
| CA5 · Permisos | El entorno de prueba permitió leer un archivo ficticio y denegó la escritura. Las sesiones del piloto usaron fuentes acotadas y diagnósticos de capacidades. | La prueba acredita el control de escritura en la ruta ensayada. Se comprobó el alcance de lectura mediante los registros observados. |
| CA6 · Integridad | Se compararon el estado Git y los hashes de las fuentes y del paquete de evidencia antes y después de los lotes. | La comprobación corresponde al conjunto registrado para el piloto. |
| CA7 · CI/CD | El revisor distinguió un build exitoso de una ejecución con pruebas. También comprobó qué reglas exigían checks según la rama de destino. | Los metadatos vinculan ejecuciones a las revisiones registradas. El SHA materializado por el paso de checkout en PR queda por confirmar. |

## Seguimiento

La revisión produjo observaciones sobre accesibilidad, trazabilidad documental y condiciones de despliegue. Las decisiones de corrección e integración se gestionan como cambios de producto separados. La revisión de seguridad fue estática y usó OWASP Top 10:2025 como referencia. [Protocolo](../orquestacion-agentes.md) · [Tareas del piloto](../../specs/010-orquestacion-agentes/tasks.md) · [OWASP Top 10:2025](https://top10.owasp.org/2025/)
