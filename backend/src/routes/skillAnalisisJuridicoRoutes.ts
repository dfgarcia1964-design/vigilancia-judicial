import { Router } from "express";
import {
  realizarAnalisisJuridico,
  analisisRapido,
  analisisPorRol,
  exportarAnalisis,
  obtenerInfoSkill,
} from "../controllers/skillAnalisisJuridicoController";

const router = Router();

/**
 * @route   POST /api/documents/:id/skill-analysis
 * @desc    Realiza análisis jurídico profundo con el skill integrado
 * @access  Private
 * @body    { contenidoDocumento, preguntaUsuario?, rol? }
 */
router.post("/:id/skill-analysis", realizarAnalisisJuridico);

/**
 * @route   POST /api/documents/:id/skill-analysis/quick
 * @desc    Análisis jurídico rápido (resumen)
 * @access  Private
 * @body    { contenidoDocumento, pregunta? }
 */
router.post("/:id/skill-analysis/quick", analisisRapido);

/**
 * @route   POST /api/documents/:id/skill-analysis/rol
 * @desc    Análisis jurídico específico por rol del usuario
 * @access  Private
 * @body    { contenidoDocumento, rol }
 * @param   rol: litigante | asesor | juez | parte_contractual
 */
router.post("/:id/skill-analysis/rol", analisisPorRol);

/**
 * @route   GET /api/documents/:id/skill-analysis/export
 * @desc    Exporta análisis jurídico en formato txt, json o pdf
 * @access  Private
 * @query   formato: txt | json | pdf (default: txt)
 */
router.get("/:id/skill-analysis/export", exportarAnalisis);

/**
 * @route   GET /api/skill-analysis/info
 * @desc    Obtiene información del skill de análisis jurídico
 * @access  Public
 */
router.get("/info", obtenerInfoSkill);

export default router;
