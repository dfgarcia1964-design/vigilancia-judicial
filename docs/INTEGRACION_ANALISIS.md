# Guía de Integración - Análisis de Documentos

## 📋 Descripción

Esta guía explica cómo integrar el módulo de análisis de documentos en la aplicación existente de vigilancia judicial.

## 🚀 Pasos de Integración

### 1. Actualizar el Schema de Prisma

El schema ya ha sido actualizado con los siguientes modelos:
- `AnalisisDocumento` - Almacena análisis de documentos
- `EntidadExtraida` - Entidades extraídas de documentos
- `SimilitudDocumento` - Similitud entre documentos
- `HistorialAnalisis` - Historial de cambios en análisis

Aplicar las migraciones:

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 2. Integrar Rutas en el Servidor Express

Editar `backend/src/index.ts` o `backend/src/app.ts`:

```typescript
import analisisDocumentoRoutes from "./routes/analisisDocumentoRoutes";

// ... resto del código ...

// Montar las rutas de análisis
app.use("/api/documents", analisisDocumentoRoutes);
```

### 3. Instalar Dependencias (si es necesario)

Para usar Claude API (recomendado):

```bash
npm install @anthropic-ai/sdk
```

### 4. Configurar Variables de Entorno

Agregar a `.env`:

```env
# Claude API
CLAUDE_API_KEY=your_api_key_here

# O si usa OpenAI:
OPENAI_API_KEY=your_openai_key

# O si usa Azure:
AZURE_COGNITIVE_KEY=your_key
AZURE_COGNITIVE_ENDPOINT=your_endpoint
```

## 📡 Endpoints de la API

### Analizar Documento
```http
POST /api/documents/analyze
Content-Type: application/json

{
  "documentoId": "doc_123",
  "tipoAnalisis": "sentence_analysis",
  "opciones": {
    "extraerEntidades": true,
    "analizarRiesgos": true,
    "buscarSimilares": true,
    "generarResumen": true
  }
}
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Análisis completado exitosamente",
  "dato": {
    "id": "anal_123",
    "documentoId": "doc_123",
    "tipoAnalisis": "sentence_analysis",
    "estado": "completado",
    "contenido": { ... },
    "entidadesExtraidas": [ ... ],
    "resumen": { ... },
    "analisisRiesgo": { ... },
    "palabrasClave": [ ... ],
    "puntajeConfianza": 0.95,
    "createdAt": "2024-09-28T10:30:00Z",
    "updatedAt": "2024-09-28T10:30:00Z"
  }
}
```

### Obtener Análisis Completo
```http
GET /api/documents/{analisisId}/analysis
```

### Análisis en Lote
```http
POST /api/documents/batch-analyze
Content-Type: application/json

{
  "documentoIds": ["doc_1", "doc_2", "doc_3"],
  "tipoAnalisis": "sentence_analysis"
}
```

### Buscar Documentos
```http
GET /api/documents/search?q=cobro+de+dinero&page=1&limit=10
```

### Clasificar Documento
```http
POST /api/documents/classify
Content-Type: application/json

{
  "documentoId": "doc_123"
}
```

### Obtener Resumen
```http
GET /api/documents/{analisisId}/summary
```

### Obtener Análisis de Riesgos
```http
GET /api/documents/{analisisId}/risks
```

### Obtener Documentos Similares
```http
GET /api/documents/{documentoId}/similar?limit=5
```

### Obtener Historial
```http
GET /api/documents/{documentoId}/history
```

## 🔌 Integración con Servicios de IA

### Ejemplo con Claude API

```typescript
import Anthropic from "@anthropic-ai/sdk";

async function analizarConClaude(contenidoDocumento: string) {
  const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Analiza este documento legal y extrae:
1. Tipo de documento
2. Partes involucradas
3. Materia legal
4. Decisión o fallo
5. Recursos disponibles

Responde en JSON estructurado.

Documento:
${contenidoDocumento}`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : null;
}
```

## 🎨 Componentes Frontend (React)

### Ejemplo: Panel de Análisis

```typescript
import React, { useState } from 'react';

interface AnalysisResult {
  id: string;
  tipoDocumento: string;
  resumen: string;
  analisisRiesgo: {
    nivelRiesgo: string;
    recomendaciones: Array<{
      titulo: string;
      descripcion: string;
      prioridad: string;
    }>;
  };
  palabrasClave: string[];
}

export const DocumentAnalysisPanel: React.FC<{ documentoId: string }> = ({
  documentoId,
}) => {
  const [analisis, setAnalisis] = useState<AnalysisResult | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analizarDocumento = async () => {
    setCargando(true);
    try {
      const response = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentoId,
          tipoAnalisis: 'sentence_analysis',
          opciones: {
            extraerEntidades: true,
            analizarRiesgos: true,
            generarResumen: true,
          },
        }),
      });

      const data = await response.json();
      if (data.exito) {
        setAnalisis(data.dato);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="analysis-panel">
      <button onClick={analizarDocumento} disabled={cargando}>
        {cargando ? 'Analizando...' : 'Analizar Documento'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {analisis && (
        <div className="analysis-result">
          <h3>Tipo: {analisis.tipoDocumento}</h3>
          <p>{analisis.resumen}</p>

          <div className="risk-assessment">
            <h4>Nivel de Riesgo: {analisis.analisisRiesgo.nivelRiesgo}</h4>
            {analisis.analisisRiesgo.recomendaciones.map((rec, i) => (
              <div key={i} className="recommendation">
                <strong>{rec.titulo}</strong>
                <p>{rec.descripcion}</p>
              </div>
            ))}
          </div>

          <div className="keywords">
            <h4>Palabras Clave</h4>
            {analisis.palabrasClave.map((palabra, i) => (
              <span key={i} className="keyword">
                {palabra}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

## 🧪 Pruebas

### Prueba con curl

```bash
# Analizar documento
curl -X POST http://localhost:3000/api/documents/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "documentoId": "doc_123",
    "tipoAnalisis": "sentence_analysis",
    "opciones": {
      "extraerEntidades": true,
      "analizarRiesgos": true
    }
  }'

# Buscar documentos
curl "http://localhost:3000/api/documents/search?q=cobro&page=1&limit=10"

# Obtener análisis
curl "http://localhost:3000/api/documents/anal_123/analysis"
```

## 🔐 Consideraciones de Seguridad

1. **Autenticación**: Agregar middleware de autenticación a todas las rutas
2. **Autorización**: Validar que el usuario tenga acceso al documento
3. **Rate Limiting**: Limitar número de análisis por usuario/día
4. **Encriptación**: Encriptar documentos en tránsito
5. **Auditoría**: Registrar acceso a análisis sensibles

### Ejemplo: Middleware de Autenticación

```typescript
import { Request, Response, NextFunction } from "express";

export const verificarAutenticacion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    // Verificar token JWT
    const usuario = verificarJWT(token);
    (req as any).usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

// Aplicar a las rutas
router.post("/analyze", verificarAutenticacion, analizarDocumento);
```

## 📊 Monitoreo y Logs

Registrar análisis importantes:

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "analisis.log" })],
});

// En el servicio
async analizarDocumento(solicitud) {
  logger.info(`Análisis iniciado: ${solicitud.documentoId}`);
  try {
    // ... análisis ...
    logger.info(`Análisis completado: ${resultado.id}`);
  } catch (error) {
    logger.error(`Error en análisis: ${error.message}`);
  }
}
```

## 🚨 Troubleshooting

### Error: "Documento no encontrado"
- Verificar que el documentoId existe en la BD
- Revisar que el usuario tenga acceso al documento

### Error: "Tipo de análisis no soportado"
- Usar valores válidos: `sentence_analysis`, `resolution_analysis`, `document_classification`

### Análisis lento
- Implementar caché de resultados
- Usar procesamiento asíncrono con colas (Bull, RabbitMQ)
- Limitar tamaño de documentos

### Memoria insuficiente
- Procesamiento en streaming para documentos grandes
- Usar workers separados para análisis

## 📚 Referencias Adicionales

- [Documentación de Análisis](./ANALISIS_DOCUMENTOS.md)
- [API de Claude](https://docs.anthropic.com)
- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
