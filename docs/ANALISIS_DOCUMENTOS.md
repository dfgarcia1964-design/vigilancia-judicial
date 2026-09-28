# Análisis de Documentos

## 📋 Descripción General

El módulo de Análisis de Documentos proporciona herramientas avanzadas para procesar, analizar y extraer información relevante de documentos legales y judiciales. Utiliza tecnologías de procesamiento de lenguaje natural (NLP) e inteligencia artificial para automatizar tareas de análisis que tradicionalmente requerían revisión manual.

## 🎯 Objetivos

1. **Automatizar análisis** de documentos legales
2. **Extraer información** clave de expedientes y sentencias
3. **Clasificar documentos** automáticamente
4. **Identificar riesgos** y oportunidades legales
5. **Generar resúmenes** ejecutivos
6. **Facilitar búsqueda** y recuperación de información

## ✨ Características Principales

### 1. Análisis de Sentencias
- Extracción automática de elementos clave
- Identificación de jurisprudencia y precedentes
- Análisis de argumentos y fundamentos legales
- Extracción de fallos y decisiones
- Clasificación de temas y subtemas

### 2. Análisis de Resoluciones y Autos
- Identificación de tipo de resolución
- Extracción de mandatos y órdenes
- Análisis de términos y plazos
- Identificación de partes afectadas
- Extracción de notificaciones requeridas

### 3. Clasificación Automática
- Clasificación por tipo de documento
- Categorización por materia legal
- Identificación de urgencia
- Determinación de prioridad
- Etiquetado automático

### 4. Extracción de Información Estructurada
```json
{
  "tipo_documento": "sentencia",
  "juzgado": "Juzgado Civil del Circuito",
  "demandante": "Juan Pérez García",
  "demandado": "Empresa XYZ S.A.",
  "materia": "Cobro de pesos",
  "fecha_sentencia": "2024-09-28",
  "decision": "Se condena al demandado",
  "cantidad_condenado": "50.000.000",
  "plazo_cumplimiento": "30 días",
  "recursos_disponibles": ["Apelación", "Casación"],
  "palabras_clave": ["cobro", "mora", "intereses", "liquidación"]
}
```

### 5. Resúmenes Inteligentes
- Resumen ejecutivo automático
- Puntos clave identificados
- Recomendaciones de acciones
- Riesgos identificados
- Oportunidades de recurso

### 6. Búsqueda y Recuperación
- Búsqueda de contenido por palabras clave
- Búsqueda semántica (por significado)
- Filtros avanzados
- Consultas booleanas
- Búsqueda de precedentes similares

### 7. Análisis de Riesgos
- Identificación de términos desfavorables
- Análisis de jurisprudencia contraria
- Evaluación de precedentes
- Indicadores de apelabilidad
- Propuesta de estrategias alternativas

## 🏗️ Arquitectura Técnica

### Backend - Endpoints API

```
POST   /api/documents/analyze              - Analizar documento
GET    /api/documents/:id/analysis         - Obtener análisis completo
POST   /api/documents/batch-analyze        - Análisis en lote
GET    /api/documents/search               - Buscar documentos
POST   /api/documents/classify             - Clasificar documento
GET    /api/documents/:id/summary          - Obtener resumen
GET    /api/documents/:id/risks            - Análisis de riesgos
GET    /api/documents/similar/:id          - Documentos similares
```

### Base de Datos - Nuevas Tablas

```sql
-- Análisis de documentos
CREATE TABLE document_analyses (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id),
  analysis_type VARCHAR(50),
  content JSONB,
  extracted_entities JSONB,
  key_phrases TEXT[],
  summary TEXT,
  risk_level VARCHAR(20),
  confidence_score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Entidades extraídas
CREATE TABLE extracted_entities (
  id UUID PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES document_analyses(id),
  entity_type VARCHAR(50),
  entity_value TEXT,
  confidence_score FLOAT,
  position_start INT,
  position_end INT,
  FOREIGN KEY (analysis_id) REFERENCES document_analyses(id)
);

-- Análisis de similitud
CREATE TABLE document_similarity (
  id UUID PRIMARY KEY,
  source_doc_id UUID NOT NULL REFERENCES documents(id),
  similar_doc_id UUID NOT NULL REFERENCES documents(id),
  similarity_score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_doc_id, similar_doc_id)
);

-- Histórico de análisis
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id),
  analysis_version INT,
  previous_analysis JSONB,
  current_analysis JSONB,
  changes JSONB,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Modelos Prisma

```prisma
model DocumentAnalysis {
  id              String   @id @default(cuid())
  document        Document @relation(fields: [documentId], references: [id])
  documentId      String
  analysisType    String
  content         Json
  extractedEntities Json
  keyPhrases      String[]
  summary         String?
  riskLevel       String?
  confidenceScore Float?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  entities        ExtractedEntity[]
  history         AnalysisHistory[]
  
  @@index([documentId])
  @@index([analysisType])
  @@index([riskLevel])
}

model ExtractedEntity {
  id              String   @id @default(cuid())
  analysis        DocumentAnalysis @relation(fields: [analysisId], references: [id])
  analysisId      String
  entityType      String
  entityValue     String
  confidenceScore Float?
  positionStart   Int?
  positionEnd     Int?
  
  @@index([analysisId])
  @@index([entityType])
}

model DocumentSimilarity {
  id              String   @id @default(cuid())
  sourceDoc       Document @relation("source", fields: [sourceDocId], references: [id])
  sourceDocId     String
  similarDoc      Document @relation("similar", fields: [similarDocId], references: [id])
  similarDocId    String
  similarityScore Float
  createdAt       DateTime @default(now())
  
  @@unique([sourceDocId, similarDocId])
  @@index([sourceDocId])
  @@index([similarDocId])
  @@index([similarityScore])
}

model AnalysisHistory {
  id              String   @id @default(cuid())
  document        Document @relation(fields: [documentId], references: [id])
  documentId      String
  analysisVersion Int
  previousAnalysis Json?
  currentAnalysis Json
  changes         Json?
  performedBy     User?     @relation(fields: [performedById], references: [id])
  performedById   String?
  createdAt       DateTime @default(now())
  
  @@index([documentId])
  @@index([analysisVersion])
}
```

## 🔌 Integraciones Externas

### Servicios de IA Recomendados

1. **Claude API** - Para análisis de texto y extracción de información
2. **OpenAI GPT-4** - Para procesamiento de lenguaje natural
3. **Azure Cognitive Services** - Para análisis de documentos
4. **Google Document AI** - Para procesamiento de PDF

### Ejemplo de Integración con Claude API

```typescript
import Anthropic from "@anthropic-ai/sdk";

async function analyzeDocument(documentContent: string) {
  const client = new Anthropic();
  
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Analiza el siguiente documento legal y extrae:
        1. Tipo de documento
        2. Partes involucradas
        3. Materia legal
        4. Puntos clave
        5. Recomendaciones de acción
        
        Documento:
        ${documentContent}`,
      },
    ],
  });

  return message.content;
}
```

## 💻 Frontend - Interfaz de Usuario

### Componentes Principales

1. **DocumentAnalysisPanel** - Panel de análisis con pestañas
2. **EntityExtractor** - Visualización de entidades extraídas
3. **RiskAssessment** - Indicadores de riesgo
4. **SimilarDocuments** - Documentos similares
5. **AnalysisTimeline** - Histórico de análisis
6. **SearchResults** - Resultados de búsqueda avanzada

### Flujo de Usuario

```
1. Usuario sube documento
   ↓
2. Sistema inicia análisis automático
   ↓
3. Se extrae información estructurada
   ↓
4. Se genera resumen y análisis de riesgos
   ↓
5. Usuario visualiza resultados en interfaz
   ↓
6. Usuario puede exportar o guardar análisis
```

## 📊 Ejemplo de Respuesta de Análisis

```json
{
  "id": "anal_123456",
  "documentId": "doc_789012",
  "analysisType": "sentence_analysis",
  "timestamp": "2024-09-28T10:30:00Z",
  "status": "completed",
  "confidenceScore": 0.95,
  "content": {
    "documentType": "Sentencia",
    "court": "Juzgado Civil del Circuito de Bogotá",
    "radicado": "2023-00123-00",
    "date": "2024-09-20",
    "judge": "Dra. María López García",
    "claimant": "Juan Pérez García",
    "defendant": "Empresa XYZ S.A.",
    "legalMatters": ["Cobro de dinero", "Incumplimiento de contrato"],
    "decision": "Se condena al demandado a pagar la suma de $50.000.000",
    "reasoning": ["Prueba documental suficiente", "Admisión de hechos"],
    "appeals": ["Apelación ante Tribunal Superior"],
    "implementation": "30 días para cumplir el fallo"
  },
  "extractedEntities": {
    "persons": [
      {"name": "Juan Pérez García", "role": "Demandante"},
      {"name": "María López García", "role": "Juez"}
    ],
    "organizations": [
      {"name": "Empresa XYZ S.A.", "role": "Demandada"}
    ],
    "monetary": [
      {"amount": "$50.000.000", "description": "Condena principal"}
    ],
    "dates": [
      {"date": "2024-09-20", "description": "Fecha de la sentencia"}
    ]
  },
  "summary": "Sentencia condenatory en cobro de dinero contra Empresa XYZ S.A. por suma de $50.000.000. Plazo de cumplimiento: 30 días. Proceden recursos de apelación.",
  "keyPhrases": ["cobro de dinero", "incumplimiento", "sentencia condenatoria", "recursos"],
  "riskAssessment": {
    "riskLevel": "medium",
    "factors": [
      "Plazo para apelación activo",
      "Empresa podría presentar excepción de falta de jurisdicción"
    ],
    "recommendations": [
      "Monitorear plazo de apelación",
      "Preparar demanda de ejecución si no se recurre"
    ]
  },
  "relatedDocuments": [
    {
      "id": "doc_456789",
      "similarity": 0.87,
      "type": "Sentencia previa"
    }
  ]
}
```

## 🚀 Plan de Implementación

### Fase 1: Configuración Base
- [ ] Crear modelos de base de datos
- [ ] Configurar integración con API de IA
- [ ] Crear endpoints básicos de análisis
- [ ] Implementar almacenamiento de resultados

### Fase 2: Análisis y Extracción
- [ ] Implementar análisis de sentencias
- [ ] Implementar análisis de resoluciones
- [ ] Desarrollo de clasificación automática
- [ ] Extracción de entidades

### Fase 3: Búsqueda y Similitud
- [ ] Implementar búsqueda de contenido
- [ ] Análisis de similitud entre documentos
- [ ] Búsqueda semántica
- [ ] Indexación de contenido

### Fase 4: UI y Frontend
- [ ] Componentes de visualización de análisis
- [ ] Panel de riesgos y recomendaciones
- [ ] Vista de entidades extraídas
- [ ] Histórico de análisis

### Fase 5: Optimizaciones
- [ ] Caché de resultados
- [ ] Procesamiento en segundo plano
- [ ] Análisis en lote
- [ ] Mejora de precisión

## 📈 Métricas de Éxito

- **Precisión del análisis**: > 90%
- **Tiempo de análisis**: < 30 segundos por documento
- **Uso de IA**: Reducción de 80% en tiempo de revisión manual
- **Satisfacción de usuarios**: > 4.5/5
- **Cobertura de documentos**: > 95% analizados correctamente

## 🔐 Consideraciones de Seguridad

- Encriptación de documentos en tránsito y reposo
- Cumplimiento HABEAS DATA
- Auditoría de acceso a análisis
- Validación de permisos por documento
- Anonimización de datos sensibles (opcional)

## 📚 Referencias

- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Natural Language Processing Best Practices](https://nlp.stanford.edu/)
- [Information Extraction Techniques](https://www.ibm.com/topics/information-extraction)
