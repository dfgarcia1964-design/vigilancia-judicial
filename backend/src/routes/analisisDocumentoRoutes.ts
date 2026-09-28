import { Router } from "express";
import {
  analizarDocumento,
  obtenerAnalisis,
  analizarEnLote,
  buscarDocumentos,
  clasificarDocumento,
  obtenerResumen,
  obtenerRiesgos,
  obtenerSimilares,
  obtenerHistorial,
} from "../controllers/analisisDocumentoController";

const router = Router();

/**
 * @route   POST /api/documents/analyze
 * @desc    Analiza un documento individual
 * @access  Private
 */
router.post("/analyze", analizarDocumento);

/**
 * @route   GET /api/documents/:id/analysis
 * @desc    Obtiene el análisis completo de un documento
 * @access  Private
 */
router.get("/:id/analysis", obtenerAnalisis);

/**
 * @route   POST /api/documents/batch-analyze
 * @desc    Analiza múltiples documentos en lote
 * @access  Private
 */
router.post("/batch-analyze", analizarEnLote);

/**
 * @route   GET /api/documents/search
 * @desc    Busca documentos por palabras clave
 * @access  Private
 */
router.get("/search", buscarDocumentos);

/**
 * @route   POST /api/documents/classify
 * @desc    Clasifica automáticamente un documento
 * @access  Private
 */
router.post("/classify", clasificarDocumento);

/**
 * @route   GET /api/documents/:id/summary
 * @desc    Obtiene el resumen ejecutivo de un análisis
 * @access  Private
 */
router.get("/:id/summary", obtenerResumen);

/**
 * @route   GET /api/documents/:id/risks
 * @desc    Obtiene el análisis de riesgos de un documento
 * @access  Private
 */
router.get("/:id/risks", obtenerRiesgos);

/**
 * @route   GET /api/documents/:id/similar
 * @desc    Obtiene documentos similares al especificado
 * @access  Private
 */
router.get("/:id/similar", obtenerSimilares);

/**
 * @route   GET /api/documents/:id/history
 * @desc    Obtiene el historial de análisis de un documento
 * @access  Private
 */
router.get("/:id/history", obtenerHistorial);

export default router;
