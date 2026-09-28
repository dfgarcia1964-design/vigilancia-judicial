import { Request, Response } from "express";
import { analisisService } from "../services/analisisDocumentoService";
import {
  TipoAnalisis,
  SolicitudAnalisisDocumento,
} from "../types/analisisDocumento";

/**
 * Analiza un documento
 * POST /api/documents/analyze
 */
export const analizarDocumento = async (req: Request, res: Response) => {
  try {
    const { documentoId, tipoAnalisis, opciones } = req.body;

    if (!documentoId || !tipoAnalisis) {
      return res
        .status(400)
        .json({ error: "documentoId y tipoAnalisis son requeridos" });
    }

    const solicitud: SolicitudAnalisisDocumento = {
      documentoId,
      tipoAnalisis,
      opciones: opciones || {
        extraerEntidades: true,
        analizarRiesgos: true,
        buscarSimilares: true,
        generarResumen: true,
      },
    };

    const resultado = await analisisService.analizarDocumento(solicitud);

    return res.status(200).json({
      exito: true,
      mensaje: "Análisis completado exitosamente",
      dato: resultado,
    });
  } catch (error) {
    console.error("Error en analizarDocumento:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al analizar documento",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene análisis completo de un documento
 * GET /api/documents/:id/analysis
 */
export const obtenerAnalisis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de análisis es requerido" });
    }

    const resultado = await analisisService.obtenerAnalisis(id);

    if (!resultado) {
      return res.status(404).json({
        exito: false,
        error: "Análisis no encontrado",
      });
    }

    return res.status(200).json({
      exito: true,
      dato: resultado,
    });
  } catch (error) {
    console.error("Error en obtenerAnalisis:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener análisis",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Realiza análisis en lote de múltiples documentos
 * POST /api/documents/batch-analyze
 */
export const analizarEnLote = async (req: Request, res: Response) => {
  try {
    const { documentoIds, tipoAnalisis, opciones } = req.body;

    if (!Array.isArray(documentoIds) || documentoIds.length === 0) {
      return res
        .status(400)
        .json({ error: "documentoIds debe ser un array no vacío" });
    }

    if (!tipoAnalisis) {
      return res.status(400).json({ error: "tipoAnalisis es requerido" });
    }

    const resultados = [];
    const errores = [];

    for (const documentoId of documentoIds) {
      try {
        const solicitud: SolicitudAnalisisDocumento = {
          documentoId,
          tipoAnalisis,
          opciones,
        };
        const resultado = await analisisService.analizarDocumento(solicitud);
        resultados.push(resultado);
      } catch (error) {
        errores.push({
          documentoId,
          error: (error as Error).message,
        });
      }
    }

    return res.status(200).json({
      exito: errores.length === 0,
      mensaje: `Análisis completado. ${resultados.length} exitosos, ${errores.length} con error`,
      data: {
        resultados,
        errores,
      },
    });
  } catch (error) {
    console.error("Error en analizarEnLote:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al procesar análisis en lote",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Busca documentos por palabras clave
 * GET /api/documents/search?q=palabra&page=1&limit=10
 */
export const buscarDocumentos = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Parámetro 'q' es requerido" });
    }

    const pagina = parseInt(page as string) || 1;
    const porPagina = Math.min(parseInt(limit as string) || 10, 50);

    const resultado = await analisisService.buscarPorPalabraClave(
      q,
      pagina,
      porPagina
    );

    return res.status(200).json({
      exito: true,
      data: {
        analisis: resultado.analisis,
        paginacion: {
          total: resultado.total,
          pagina: resultado.pagina,
          porPagina: resultado.porPagina,
          totalPaginas: Math.ceil(resultado.total / resultado.porPagina),
        },
      },
    });
  } catch (error) {
    console.error("Error en buscarDocumentos:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al buscar documentos",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Clasifica un documento
 * POST /api/documents/classify
 */
export const clasificarDocumento = async (req: Request, res: Response) => {
  try {
    const { documentoId } = req.body;

    if (!documentoId) {
      return res.status(400).json({ error: "documentoId es requerido" });
    }

    const solicitud: SolicitudAnalisisDocumento = {
      documentoId,
      tipoAnalisis: TipoAnalisis.CLASIFICACION_DOCUMENTO,
      opciones: {
        extraerEntidades: false,
        analizarRiesgos: false,
        buscarSimilares: false,
        generarResumen: false,
      },
    };

    const resultado = await analisisService.analizarDocumento(solicitud);

    return res.status(200).json({
      exito: true,
      mensaje: "Clasificación completada",
      dato: resultado,
    });
  } catch (error) {
    console.error("Error en clasificarDocumento:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al clasificar documento",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene resumen de un documento
 * GET /api/documents/:id/summary
 */
export const obtenerResumen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de análisis es requerido" });
    }

    const analisis = await analisisService.obtenerAnalisis(id);

    if (!analisis) {
      return res.status(404).json({
        exito: false,
        error: "Análisis no encontrado",
      });
    }

    return res.status(200).json({
      exito: true,
      dato: {
        resumen: analisis.resumen,
        palabrasClave: analisis.palabrasClave,
        puntajeConfianza: analisis.puntajeConfianza,
      },
    });
  } catch (error) {
    console.error("Error en obtenerResumen:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener resumen",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene análisis de riesgos de un documento
 * GET /api/documents/:id/risks
 */
export const obtenerRiesgos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de análisis es requerido" });
    }

    const analisis = await analisisService.obtenerAnalisis(id);

    if (!analisis) {
      return res.status(404).json({
        exito: false,
        error: "Análisis no encontrado",
      });
    }

    return res.status(200).json({
      exito: true,
      dato: analisis.analisisRiesgo,
    });
  } catch (error) {
    console.error("Error en obtenerRiesgos:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener análisis de riesgos",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene documentos similares
 * GET /api/documents/:id/similar?limit=5
 */
export const obtenerSimilares = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const limitNum = Math.min(parseInt(limit as string) || 5, 20);
    const similares = await analisisService.buscarDocumentosSimilares(
      id,
      limitNum
    );

    return res.status(200).json({
      exito: true,
      dato: similares,
    });
  } catch (error) {
    console.error("Error en obtenerSimilares:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener documentos similares",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene historial de análisis de un documento
 * GET /api/documents/:id/history
 */
export const obtenerHistorial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const historial = await analisisService.obtenerHistorial(id);

    return res.status(200).json({
      exito: true,
      dato: historial,
    });
  } catch (error) {
    console.error("Error en obtenerHistorial:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener historial",
      mensaje: (error as Error).message,
    });
  }
};
