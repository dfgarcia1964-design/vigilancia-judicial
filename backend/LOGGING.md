# 📊 Sistema de Logging - Vigilancia Judicial

## Overview

El sistema de logging está implementado con Winston y proporciona:
- Logging estructurado en 4 niveles: error, warn, info, debug
- Logs en consola con colores en desarrollo
- Logs en archivos para persistencia
- Middleware de logging de requests HTTP

## Configuración

### Niveles de Log

- **error**: Errores críticos que requieren atención inmediata
- **warn**: Advertencias sobre comportamiento inesperado
- **info**: Información general de operaciones exitosas
- **debug**: Información detallada para debugging (solo en desarrollo)

### Archivos de Log

Los logs se guardan en la carpeta `logs/`:

- **logs/all.log**: Todos los logs (todas las operaciones)
- **logs/error.log**: Solo logs de error (para monitoreo crítico)

## Uso en Código

### Importar Logger

```typescript
import logger from '../lib/logger.js'
```

### Ejemplos

```typescript
// Info - Operación exitosa
logger.info('Usuario registrado exitosamente', { userId: user.id, email })

// Warn - Comportamiento inesperado
logger.warn('Intento de login fallido', { email })

// Error - Error crítico
logger.error('Error de base de datos', { error: err.message })

// Debug - Información detallada (solo en desarrollo)
logger.debug('Datos recibidos', { payload: req.body })
```

## Request Logging

El middleware de logging registra automáticamente:

- Method: GET, POST, PUT, DELETE, etc.
- URL: Path del endpoint
- Status Code: HTTP status
- Duration: Tiempo de respuesta en ms
- IP: Dirección IP del cliente
- User ID: ID del usuario autenticado (si existe)

### Niveles por Status

- 2xx → info ✅
- 4xx → warn ⚠️
- 5xx → error ❌

## Monitoreo en Producción

### Logs a Monitorear

1. **Errores de Autenticación**: Fallos en login/register
2. **Operaciones CRUD**: Creación, actualización, eliminación
3. **Errores de Base de Datos**: Timeouts, conflictos
4. **Performance**: Requests lentos (> 1000ms)

### Alertas Recomendadas

- Más de 5 fallos de login en 1 minuto (posible ataque)
- Errores 5xx aumentados (problema del servidor)
- Response times > 2 segundos (performance issue)

## Desarrollo Local

En desarrollo, los logs se muestran en la consola con colores para fácil lectura.

## Integración Futura

Para futuras implementaciones, los logs pueden integrarse con:

- **New Relic**: Importar logs con correlation IDs
- **DataDog**: Usar structured logging (ya soportado)
- **ELK Stack**: Enviar logs a Elasticsearch
- **CloudWatch**: AWS logging service
