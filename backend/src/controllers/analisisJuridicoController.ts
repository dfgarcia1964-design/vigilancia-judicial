import { Request, Response } from "express";
import { analisisJuridicoService } from "../services/analisisJuridicoService";
import { SolicitudAnalisisJuridico } from "../types/analisisJuridico";

/**
 * Realiza análisis jurídico profundo de un documento
 * POST /api/documents/:id/legal-analysis
 */
export const analizarJuridicamente = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { preguntaJuridica, rolUsuario, profundidad } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
      preguntaJuridica,
      rolUsuario: rolUsuario || "asesor",
      profundidad: profundidad || "profunda",
    };

    const resultado =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    return res.status(200).json({
      exito: true,
      mensaje: "Análisis jurídico completado exitosamente",
      dato: resultado,
    });
  } catch (error) {
    console.error("Error en analizarJuridicamente:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al realizar análisis jurídico",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene análisis jurídico completo
 * GET /api/documents/:id/legal-analysis
 */
export const obtenerAnalisisJuridico = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const analisis = await analisisJuridicoService.obtenerAnalisisJuridico(id);

    if (!analisis) {
      return res.status(404).json({
        exito: false,
        error: "Análisis jurídico no encontrado",
      });
    }

    return res.status(200).json({
      exito: true,
      dato: analisis,
    });
  } catch (error) {
    console.error("Error en obtenerAnalisisJuridico:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener análisis jurídico",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene la norma aplicable de un documento
 * GET /api/documents/:id/legal-analysis/norms
 */
export const obtenerNormasAplicables = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    // Realizar análisis para obtener normas
    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    return res.status(200).json({
      exito: true,
      dato: {
        normas: analisis.normaAplicable,
        conflictosNormativos: analisis.normaAplicable
          .filter((n) => n.antinomias && n.antinomias.length > 0)
          .map((n) => ({
            norma: n.referencia,
            antinomias: n.antinomias,
            resolucion: n.resolucion,
          })),
      },
    });
  } catch (error) {
    console.error("Error en obtenerNormasAplicables:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener normas aplicables",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene los hechos jurídicamente relevantes
 * GET /api/documents/:id/legal-analysis/facts
 */
export const obtenerHechosJuridicos = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    return res.status(200).json({
      exito: true,
      dato: {
        hechos: analisis.hechosJuridicos,
        vaciosProbatorios: analisis.hechosJuridicos
          .filter((h) => h.vaciosProbaltorios && h.vaciosProbaltorios.length > 0)
          .map((h) => ({
            hecho: h.descripcion,
            vacios: h.vaciosProbaltorios,
          })),
      },
    });
  } catch (error) {
    console.error("Error en obtenerHechosJuridicos:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener hechos jurídicos",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene subsunción y argumentos jurídicos
 * GET /api/documents/:id/legal-analysis/arguments
 */
export const obtenerArgumentos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    return res.status(200).json({
      exito: true,
      dato: {
        subsuncion: analisis.subsuncionAnalisis,
        coherencia: analisis.coherenciaControl,
      },
    });
  } catch (error) {
    console.error("Error en obtenerArgumentos:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener argumentos jurídicos",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene consecuencias jurídicas según rol
 * GET /api/documents/:id/legal-analysis/consequences?rol=litigante
 */
export const obtenerConsecuencias = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rol = "asesor" } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
      rolUsuario: rol as any,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    return res.status(200).json({
      exito: true,
      dato: {
        rol: rol,
        consecuencias: analisis.consecuenciasJuridicas,
      },
    });
  } catch (error) {
    console.error("Error en obtenerConsecuencias:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener consecuencias jurídicas",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene valoración de autoridad argumentativa
 * GET /api/documents/:id/legal-analysis/authority
 */
export const obtenerAutoridadArgumentativa = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    return res.status(200).json({
      exito: true,
      dato: {
        solidez: analisis.autoridadArgumentativa.solidezArgumento,
        fuentesNormativas: analisis.autoridadArgumentativa.fuentesNormativas,
        fuentesJurisprudenciales:
          analisis.autoridadArgumentativa.fuentesJurisprudenciales,
      },
    });
  } catch (error) {
    console.error("Error en obtenerAutoridadArgumentativa:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener autoridad argumentativa",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene campos pendientes y validaciones requeridas
 * GET /api/documents/:id/legal-analysis/pending
 */
export const obtenerCamposPendientes = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);

    const semaforo = analisis.camposPendientes.reduce(
      (acc, campo) => {
        acc[campo.tipo] = (acc[campo.tipo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return res.status(200).json({
      exito: true,
      dato: {
        total: analisis.camposPendientes.length,
        semaforo,
        campos: analisis.camposPendientes,
      },
    });
  } catch (error) {
    console.error("Error en obtenerCamposPendientes:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al obtener campos pendientes",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Exporta análisis jurídico a formato legible
 * GET /api/documents/:id/legal-analysis/export?format=txt
 */
export const exportarAnalisisJuridico = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { format = "txt" } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID de documento es requerido" });
    }

    const solicitud: SolicitudAnalisisJuridico = {
      documentoId: id,
    };

    const analisis =
      await analisisJuridicoService.analizarDocumentoJuridicamente(solicitud);
    const reporte = await analisisJuridicoService.exportarAnalisisJuridico(
      analisis
    );

    if (format === "json") {
      return res.status(200).json({
        exito: true,
        dato: analisis,
      });
    } else {
      // Retornar como texto plano
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="analisis-juridico-${id}.txt"`
      );
      return res.status(200).send(reporte);
    }
  } catch (error) {
    console.error("Error en exportarAnalisisJuridico:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al exportar análisis jurídico",
      mensaje: (error as Error).message,
    });
  }
};
