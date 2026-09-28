import { Router } from "express";
import {
  analizarJuridicamente,
  obtenerAnalisisJuridico,
  obtenerNormasAplicables,
  obtenerHechosJuridicos,
  obtenerArgumentos,
  obtenerConsecuencias,
  obtenerAutoridadArgumentativa,
  obtenerCamposPendientes,
  exportarAnalisisJuridico,
} from "../controllers/analisisJuridicoController";

const router = Router();

/**
 * @route   POST /api/documents/:id/legal-analysis
 * @desc    Realiza análisis jurídico profundo (6 objetivos del skill)
 * @access  Private
 * @params  preguntaJuridica (opcional), rolUsuario (litigante|asesor|juez|parte_contractual), profundidad (basica|media|profunda)
 */
router.post("/:id/legal-analysis", analizarJuridicamente);

/**
 * @route   GET /api/documents/:id/legal-analysis
 * @desc    Obtiene análisis jurídico completo
 * @access  Private
 */
router.get("/:id/legal-analysis", obtenerAnalisisJuridico);

/**
 * @route   GET /api/documents/:id/legal-analysis/norms
 * @desc    Objetivo 1: Norma aplicable
 * @access  Private
 */
router.get("/:id/legal-analysis/norms", obtenerNormasAplicables);

/**
 * @route   GET /api/documents/:id/legal-analysis/facts
 * @desc    Objetivo 2: Hechos jurídicamente relevantes
 * @access  Private
 */
router.get("/:id/legal-analysis/facts", obtenerHechosJuridicos);

/**
 * @route   GET /api/documents/:id/legal-analysis/arguments
 * @desc    Objetivo 3: Subsunción / Distinción
 * @access  Private
 */
router.get("/:id/legal-analysis/arguments", obtenerArgumentos);

/**
 * @route   GET /api/documents/:id/legal-analysis/consequences
 * @desc    Objetivo 4: Consecuencias jurídicas
 * @access  Private
 * @query   rol: litigante|asesor|juez|parte_contractual
 */
router.get("/:id/legal-analysis/consequences", obtenerConsecuencias);

/**
 * @route   GET /api/documents/:id/legal-analysis/authority
 * @desc    Objetivo 6: Autoridad argumentativa
 * @access  Private
 */
router.get("/:id/legal-analysis/authority", obtenerAutoridadArgumentativa);

/**
 * @route   GET /api/documents/:id/legal-analysis/pending
 * @desc    Campos pendientes (Verificar, Dato faltante, Revisar)
 * @access  Private
 */
router.get("/:id/legal-analysis/pending", obtenerCamposPendientes);

/**
 * @route   GET /api/documents/:id/legal-analysis/export
 * @desc    Exporta análisis jurídico en formato txt o json
 * @access  Private
 * @query   format: txt|json (default: txt)
 */
router.get("/:id/legal-analysis/export", exportarAnalisisJuridico);

export default router;
