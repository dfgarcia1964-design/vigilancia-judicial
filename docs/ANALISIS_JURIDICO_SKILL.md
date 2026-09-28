# Análisis Jurídico Profundo - Integración del Skill

## 📋 Descripción

Integración del skill **analisis-juridico** en el módulo de análisis de documentos. Proporciona análisis jurídico riguroso siguiendo los **6 objetivos del framework de análisis jurídico experto**.

## 🎯 Los 6 Objetivos de Análisis

### 1. Norma Aplicable
Identifica la regla jurídica que rige la situación:
- Constitución y tratados internacionales
- Leyes, códigos, decretos
- Jurisprudencia vinculante y precedentes
- Resolución de antinomias (conflictos normativos)

**Marcar normas no verificadas**: `[VERIFICAR ANTES DE USAR]`

### 2. Hechos Jurídicamente Relevantes
Depura el documento para identificar solo lo que importa:
- Hechos que encuadran en el supuesto normativo
- Contexto vs. datos sin consecuencia legal
- Vacíos probatorios que pueden debilitar posiciones

### 3. Subsunción o Distinción
El corazón del análisis, estructura TIPC:
- **T**esis: Afirmación jurídica central
- **I**nfracción: Norma vulnerada (con cita)
- **P**rueba: Evidencia del documento
- **C**onsecuencia: Lo que debe ocurrir

O **Distinción**: Si un precedente invocado no aplica, demuéstralo.

### 4. Consecuencias Jurídicas
Varían según el rol del usuario:

| Rol | Foco |
|---|---|
| **Litigante** | Consecuencia favorable, pretensiones procedentes |
| **Asesor** | Predicción de riesgo, escenarios posibles |
| **Juez** | Justificación coherente de la decisión |
| **Parte contractual** | Derechos, obligaciones, incumplimientos, remedios |

### 5. Control de Coherencia
Verifica antes de presentar:
- ¿Las premisas sustentan la conclusión sin salto lógico?
- ¿Hay contradicciones internas?
- ¿El argumento resiste la objeción más fuerte?

### 6. Legitimación Argumentativa
Cierra con síntesis de autoridad:
- Fuentes normativas verificadas
- Jurisprudencia con número, tribunal, fecha
- Solidez del argumento y vulnerabilidades

## 📡 Endpoints de API

### Análisis Jurídico Completo
```http
POST /api/documents/:id/legal-analysis
Content-Type: application/json

{
  "preguntaJuridica": "¿Es procedente la pretensión del demandante?",
  "rolUsuario": "asesor",
  "profundidad": "profunda"
}
```

**Respuesta:**
```json
{
  "exito": true,
  "dato": {
    "documentoId": "doc_123",
    "tipoDocumento": "sentencia",
    "preguntaJuridica": "¿Es procedente la pretensión del demandante?",
    "normaAplicable": [...],
    "hechosJuridicos": [...],
    "subsuncionAnalisis": {...},
    "consecuenciasJuridicas": [...],
    "coherenciaControl": {...},
    "autoridadArgumentativa": {...},
    "resumen": "...",
    "camposPendientes": [...]
  }
}
```

### Objetivos Individuales

#### Objetivo 1: Normas Aplicables
```http
GET /api/documents/:id/legal-analysis/norms
```

Retorna:
- Lista de normas identificadas
- Conflictos normativos (antinomias)
- Resolución de conflictos

#### Objetivo 2: Hechos Jurídicos
```http
GET /api/documents/:id/legal-analysis/facts
```

Retorna:
- Hechos jurídicamente relevantes
- Vacíos probatorios
- Contexto vs. datos relevantes

#### Objetivo 3: Argumentos (Subsunción/Distinción)
```http
GET /api/documents/:id/legal-analysis/arguments
```

Retorna:
- Argumentos TIPC (Tesis, Infracción, Prueba, Consecuencia)
- Análisis de distinción (si aplica)
- Control de coherencia interna

#### Objetivo 4: Consecuencias Jurídicas
```http
GET /api/documents/:id/legal-analysis/consequences?rol=litigante
```

Parámetros:
- `rol`: litigante | asesor | juez | parte_contractual

Retorna:
- Consecuencias según rol
- Pretensiones o riesgos
- Remedios disponibles

#### Objetivo 6: Autoridad Argumentativa
```http
GET /api/documents/:id/legal-analysis/authority
```

Retorna:
- Solidez del argumento
- Fortalezas y vulnerabilidades
- Fuentes normativas y jurisprudenciales

### Campos Pendientes
```http
GET /api/documents/:id/legal-analysis/pending
```

Retorna:
- Campos que requieren verificación
- Datos faltantes
- Clasificación por tipo de riesgo

### Exportar Análisis
```http
GET /api/documents/:id/legal-analysis/export?format=txt
```

Parámetros:
- `format`: txt | json (default: txt)

Retorna reporte legible en formato seleccionado.

## 🔐 Estándares de Integridad

### No Alucinar
- Nunca inventes normas, fechas, expedientes ni sentencias
- Si no tienes la cita exacta, márcala `[VERIFICAR ANTES DE USAR]`
- Describe el tipo de norma que debería existir

### Proporcionalidad
- Ajusta profundidad al documento y pregunta
- Contrato de 2 páginas ≠ Sentencia de 40 páginas
- Basíca, Media o Profunda según necesidad

### Semáforo de Fuentes
- ✅ **Verificada y vigente**
- ⚠ **Verificar vigencia o aplicabilidad**
- ❌ **Alto riesgo — no usar sin confirmar**

## 💻 Ejemplo de Integración Frontend (React)

```typescript
import React, { useState } from 'react';

interface LegalAnalysisResult {
  preguntaJuridica: string;
  normaAplicable: Array<{
    referencia: string;
    descripcion: string;
  }>;
  hechosJuridicos: Array<{
    descripcion: string;
    relevancia: string;
  }>;
  consecuenciasJuridicas: Array<{
    consecuencia: string;
    pretensiones?: string[];
    riesgos?: Array<{
      descripcion: string;
      probabilidad: string;
    }>;
  }>;
  camposPendientes: Array<{
    tipo: string;
    descripcion: string;
  }>;
}

export const LegalAnalysisPanel: React.FC<{ documentoId: string }> = ({
  documentoId,
}) => {
  const [analisis, setAnalisis] = useState<LegalAnalysisResult | null>(null);
  const [rol, setRol] = useState<string>('asesor');
  const [cargando, setCargando] = useState(false);

  const analizarDocumento = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        `/api/documents/${documentoId}/legal-analysis`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rolUsuario: rol,
            profundidad: 'profunda',
          }),
        }
      );

      const data = await response.json();
      if (data.exito) {
        setAnalisis(data.dato);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="legal-analysis">
      <div className="analysis-controls">
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="litigante">Litigante</option>
          <option value="asesor">Asesor</option>
          <option value="juez">Juez</option>
          <option value="parte_contractual">Parte Contractual</option>
        </select>
        <button onClick={analizarDocumento} disabled={cargando}>
          {cargando ? 'Analizando...' : 'Análisis Jurídico'}
        </button>
      </div>

      {analisis && (
        <div className="analysis-result">
          <h3>Pregunta Jurídica</h3>
          <p>{analisis.preguntaJuridica}</p>

          <h4>Normas Aplicables</h4>
          <ul>
            {analisis.normaAplicable.map((norma, i) => (
              <li key={i}>
                <strong>{norma.referencia}</strong>: {norma.descripcion}
              </li>
            ))}
          </ul>

          <h4>Hechos Jurídicamente Relevantes</h4>
          <ul>
            {analisis.hechosJuridicos.map((hecho, i) => (
              <li key={i}>
                ({hecho.relevancia}) {hecho.descripcion}
              </li>
            ))}
          </ul>

          <h4>Consecuencias Jurídicas</h4>
          {analisis.consecuenciasJuridicas.map((cons, i) => (
            <div key={i} className="consequence">
              <p>{cons.consecuencia}</p>
              {cons.pretensiones && (
                <ul>
                  {cons.pretensiones.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              )}
              {cons.riesgos && (
                <div className="risks">
                  {cons.riesgos.map((r, j) => (
                    <p key={j}>
                      ⚠ {r.descripcion} ({r.probabilidad})
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {analisis.camposPendientes.length > 0 && (
            <div className="pending">
              <h4>Campos Pendientes</h4>
              {analisis.camposPendientes.map((campo, i) => (
                <div key={i} className={`pending-${campo.tipo}`}>
                  [{campo.tipo.toUpperCase()}] {campo.descripcion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

## 🧪 Ejemplos de Uso

### Análisis de Sentencia (Litigante)
```bash
curl -X POST http://localhost:3000/api/documents/doc_123/legal-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "preguntaJuridica": "¿Es procedente la pretensión del demandante?",
    "rolUsuario": "litigante",
    "profundidad": "profunda"
  }'
```

### Análisis de Riesgos (Asesor)
```bash
curl -X POST http://localhost:3000/api/documents/doc_456/legal-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "preguntaJuridica": "¿Cuáles son los riesgos procesales?",
    "rolUsuario": "asesor",
    "profundidad": "profunda"
  }'
```

### Obtener Solo Normas
```bash
curl http://localhost:3000/api/documents/doc_123/legal-analysis/norms
```

### Obtener Riesgos para Asesor
```bash
curl "http://localhost:3000/api/documents/doc_123/legal-analysis/consequences?rol=asesor"
```

### Exportar a Texto
```bash
curl "http://localhost:3000/api/documents/doc_123/legal-analysis/export?format=txt" \
  -o analisis.txt
```

## 🔄 Flujo de Integración

1. **Usuario sube documento** → Sistema extrae información
2. **Usuario solicita análisis jurídico** → Servicio analiza con 6 objetivos
3. **Sistema identifica campos pendientes** → Marca con semáforo
4. **Usuario revisa análisis** → Puede ver cada objetivo individualmente
5. **Usuario exporta reporte** → Formato txt o json

## 📚 Referencia de Marcos Normativos

El sistema puede especializar análisis para:

### Derecho Civil
- Códigos civiles (contratos, obligaciones)
- Derechos de propiedad
- Responsabilidad civil

### Derecho Laboral
- Derechos laborales
- Seguridad social
- Conflictos de trabajo

### Derecho Administrativo
- Procedimientos administrativos
- Actos administrativos
- Recursos administrativos

### Derecho Penal
- Delitos y sanciones
- Procedimientos penales
- Derechos del procesado

## ⚠️ Limitaciones y Consideraciones

1. **Precisión**: Los análisis son tan buenos como los datos de entrada
2. **Verificación**: Campos marcados `[VERIFICAR]` requieren confirmación manual
3. **Cambios normativos**: La jurisprudencia puede cambiar, verificar vigencia
4. **Contexto**: Algunos análisis pueden requerir más contexto del caso
5. **Especialidad**: Para casos muy complejos, consultar abogado especialista

## 🔗 Integración con Módulo de Análisis Automático

El análisis jurídico profundo complementa el análisis automático:

**Análisis Automático** (Módulo anterior)
- ✅ Extracción rápida de entidades
- ✅ Clasificación automática
- ✅ Búsqueda y similitud

**Análisis Jurídico** (Este módulo)
- ✅ Análisis profundo según 6 objetivos
- ✅ Evaluación de solidez argumentativa
- ✅ Recomendaciones estratégicas por rol
- ✅ Identificación de riesgos legales

**Flujo Combinado**:
1. Análisis automático → Información estructurada
2. Análisis jurídico → Interpretación legal profunda
3. Reporte integrado → Decisión informada

---

**Estado**: Integración completada ✅
**Última actualización**: 2024-09-28
