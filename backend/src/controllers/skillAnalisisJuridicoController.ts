import { Request, Response } from "express";
import {
  skillAnalisisService,
  SolicitudSkillAnalisis,
} from "../services/skillAnalisisJuridicoService";

/**
 * Realiza análisis jurídico usando el skill integrado
 * POST /api/documents/:id/skill-analysis
 */
export const realizarAnalisisJuridico = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { contenidoDocumento, preguntaUsuario, rol } = req.body;

    if (!id || !contenidoDocumento) {
      return res.status(400).json({
        error: "ID de documento y contenido del documento son requeridos",
      });
    }

    const solicitud: SolicitudSkillAnalisis = {
      documentoId: id,
      contenidoDocumento,
      preguntaUsuario,
      rol: rol || "asesor",
    };

    const resultado = await skillAnalisisService.analizarConSkill(solicitud);

    return res.status(200).json({
      exito: resultado.exito,
      mensaje: resultado.exito
        ? "Análisis jurídico completado"
        : "Error en análisis",
      dato: {
        analisis: resultado.analisis,
        estructura: resultado.estructuraAnalisis,
        timestamp: resultado.timestamp,
      },
    });
  } catch (error) {
    console.error("Error en realizarAnalisisJuridico:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al realizar análisis jurídico",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene análisis rápido (resumen ejecutivo)
 * POST /api/documents/:id/skill-analysis/quick
 */
export const analisisRapido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contenidoDocumento, pregunta } = req.body;

    if (!id || !contenidoDocumento) {
      return res.status(400).json({
        error: "Parámetros requeridos faltantes",
      });
    }

    const solicitud: SolicitudSkillAnalisis = {
      documentoId: id,
      contenidoDocumento,
      preguntaUsuario: pregunta || "¿Cuál es el análisis jurídico de este documento?",
      rol: "asesor",
    };

    const resultado = await skillAnalisisService.analizarConSkill(solicitud);

    // Extraer solo primera parte del análisis para respuesta rápida
    const primeraLinea = resultado.analisis.split("\n").slice(0, 10).join("\n");

    return res.status(200).json({
      exito: resultado.exito,
      dato: {
        resumen: primeraLinea,
        analisisCompleto: resultado.analisis,
      },
    });
  } catch (error) {
    console.error("Error en analisisRapido:", error);
    return res.status(500).json({
      exito: false,
      error: "Error en análisis rápido",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene análisis específico por rol
 * POST /api/documents/:id/skill-analysis/rol
 */
export const analisisPorRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contenidoDocumento, rol = "asesor" } = req.body;

    if (!id || !contenidoDocumento) {
      return res.status(400).json({
        error: "Parámetros requeridos faltantes",
      });
    }

    const rolesValidos = ["litigante", "asesor", "juez", "parte_contractual"];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        error: `Rol inválido. Debe ser: ${rolesValidos.join(", ")}`,
      });
    }

    const preguntasRol: Record<string, string> = {
      litigante: "¿Cuáles son las consecuencias favorables y pretensiones procedentes?",
      asesor: "¿Cuáles son los riesgos y escenarios procesales posibles?",
      juez: "¿Cómo se justifica la decisión coherentemente?",
      parte_contractual: "¿Cuáles son los derechos, obligaciones y remedios disponibles?",
    };

    const solicitud: SolicitudSkillAnalisis = {
      documentoId: id,
      contenidoDocumento,
      preguntaUsuario: preguntasRol[rol],
      rol: rol as any,
    };

    const resultado = await skillAnalisisService.analizarConSkill(solicitud);

    return res.status(200).json({
      exito: resultado.exito,
      rol: rol,
      dato: {
        analisis: resultado.analisis,
        estructura: resultado.estructuraAnalisis,
      },
    });
  } catch (error) {
    console.error("Error en analisisPorRol:", error);
    return res.status(500).json({
      exito: false,
      error: "Error en análisis por rol",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Exporta análisis en diferentes formatos
 * GET /api/documents/:id/skill-analysis/export
 */
export const exportarAnalisis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { formato = "txt" } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "ID de documento es requerido",
      });
    }

    // En producción: recuperar análisis de BD
    // Por ahora: generar on-demand
    const solicitud: SolicitudSkillAnalisis = {
      documentoId: id,
      contenidoDocumento: "Documento cargado",
    };

    const resultado = await skillAnalisisService.analizarConSkill(solicitud);
    const exportado = await skillAnalisisService.exportarAnalisis(
      resultado,
      formato as "txt" | "json" | "pdf"
    );

    if (formato === "json") {
      return res.status(200).json({
        exito: true,
        dato: exportado,
      });
    } else {
      // Formato texto
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="analisis-juridico-${id}.txt"`
      );
      return res.status(200).send(exportado);
    }
  } catch (error) {
    console.error("Error en exportarAnalisis:", error);
    return res.status(500).json({
      exito: false,
      error: "Error al exportar análisis",
      mensaje: (error as Error).message,
    });
  }
};

/**
 * Obtiene información sobre el skill de análisis jurídico
 * GET /api/skill-analysis/info
 */
export const obtenerInfoSkill = async (req: Request, res: Response) => {
  return res.status(200).json({
    exito: true,
    dato: {
      nombre: "Análisis Jurídico Riguroso",
      descripcion:
        "Análisis jurídico profundo aplicando 6 objetivos y estándares de integridad",
      objetivos: [
        "Norma aplicable",
        "Hechos jurídicamente relevantes",
        "Subsunción/Distinción",
        "Consecuencias jurídicas",
        "Control de coherencia",
        "Legitimación argumentativa",
      ],
      rolesDisponibles: [
        "litigante",
        "asesor",
        "juez",
        "parte_contractual",
      ],
      endpoints: [
        {
          metodo: "POST",
          ruta: "/api/documents/:id/skill-analysis",
          descripcion: "Análisis completo",
        },
        {
          metodo: "POST",
          ruta: "/api/documents/:id/skill-analysis/quick",
          descripcion: "Análisis rápido",
        },
        {
          metodo: "POST",
          ruta: "/api/documents/:id/skill-analysis/rol",
          descripcion: "Análisis específico por rol",
        },
        {
          metodo: "GET",
          ruta: "/api/documents/:id/skill-analysis/export",
          descripcion: "Exportar análisis",
        },
      ],
      estandares: {
        verificacion: "[VERIFICAR ANTES DE USAR]",
        datoFaltante: "[DATO FALTANTE]",
        revisar: "[REVISAR]",
        semaforoDatos: {
          verificada: "✅",
          verificar: "⚠",
          altoRiesgo: "❌",
        },
      },
    },
  });
};
