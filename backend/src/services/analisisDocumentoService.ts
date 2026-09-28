import { PrismaClient } from "@prisma/client";
import {
  TipoAnalisis,
  EstadoAnalisis,
  SolicitudAnalisisDocumento,
  ResultadoAnalisis,
  ContenidoAnalisis,
  EntidadExtraida,
  AnalisisRiesgo,
  NivelRiesgo,
} from "../types/analisisDocumento";

const prisma = new PrismaClient();

export class AnalisisDocumentoService {
  /**
   * Inicia el análisis de un documento
   */
  async analizarDocumento(
    solicitud: SolicitudAnalisisDocumento
  ): Promise<ResultadoAnalisis> {
    try {
      // Crear registro de análisis
      const analisis = await prisma.analisisDocumento.create({
        data: {
          documentoId: solicitud.documentoId,
          tipoAnalisis: solicitud.tipoAnalisis,
          estado: EstadoAnalisis.EN_PROCESO,
        },
      });

      // Obtener contenido del documento
      const documento = await prisma.documento.findUnique({
        where: { id: solicitud.documentoId },
      });

      if (!documento) {
        throw new Error("Documento no encontrado");
      }

      // Procesar análisis según tipo
      const resultadoAnalisis = await this.procesarAnalisisPorTipo(
        documento,
        solicitud.tipoAnalisis
      );

      // Extraer entidades si se solicita
      let entidadesExtraidas: EntidadExtraida[] = [];
      if (solicitud.opciones?.extraerEntidades) {
        entidadesExtraidas = await this.extraerEntidades(
          resultadoAnalisis.contenido
        );
      }

      // Analizar riesgos si se solicita
      let analisisRiesgo: AnalisisRiesgo | null = null;
      if (solicitud.opciones?.analizarRiesgos) {
        analisisRiesgo = await this.analizarRiesgos(resultadoAnalisis.contenido);
      }

      // Generar resumen si se solicita
      const resumen = solicitud.opciones?.generarResumen
        ? await this.generarResumen(resultadoAnalisis.contenido)
        : null;

      // Guardar resultados en BD
      const analisisActualizado = await prisma.analisisDocumento.update({
        where: { id: analisis.id },
        data: {
          estado: EstadoAnalisis.COMPLETADO,
          contenidoAnalisis: JSON.stringify(resultadoAnalisis.contenido),
          resumen: resumen ? JSON.stringify(resumen) : null,
          palabrasClave: JSON.stringify(resultadoAnalisis.palabrasClave),
          entidadesExtraidas: JSON.stringify(entidadesExtraidas),
          tipoDocumento: resultadoAnalisis.contenido.tipoDocumento,
          materia: resultadoAnalisis.contenido.materia
            ? JSON.stringify(resultadoAnalisis.contenido.materia)
            : null,
          nivelRiesgo: analisisRiesgo?.nivelRiesgo,
          puntajeConfianza: resultadoAnalisis.puntajeConfianza,
          partes: resultadoAnalisis.contenido.partes
            ? JSON.stringify(resultadoAnalisis.contenido.partes)
            : null,
          juzgado: resultadoAnalisis.contenido.juzgado,
          fecha: resultadoAnalisis.contenido.fecha,
          radicado: resultadoAnalisis.contenido.radicado,
          recomendaciones: analisisRiesgo
            ? JSON.stringify(analisisRiesgo.recomendaciones)
            : null,
          recursosDisponibles: resultadoAnalisis.contenido.recursosDisponibles
            ? JSON.stringify(resultadoAnalisis.contenido.recursosDisponibles)
            : null,
        },
      });

      // Guardar entidades extraídas
      if (entidadesExtraidas.length > 0) {
        await prisma.entidadExtraida.createMany({
          data: entidadesExtraidas.map((e) => ({
            analisisId: analisisActualizado.id,
            tipoEntidad: e.tipoEntidad,
            valor: e.valor,
            puntajeConfianza: e.puntajeConfianza,
            posicionInicio: e.posicionInicio,
            posicionFin: e.posicionFin,
            contexto: e.contexto,
          })),
        });
      }

      return this.formatearResultado(analisisActualizado);
    } catch (error) {
      console.error("Error al analizar documento:", error);

      // Guardar estado de error
      await prisma.analisisDocumento.update({
        where: { id: (error as any).analisisId },
        data: { estado: EstadoAnalisis.ERROR },
      });

      throw error;
    }
  }

  /**
   * Procesa el análisis según el tipo específico
   */
  private async procesarAnalisisPorTipo(
    documento: any,
    tipoAnalisis: TipoAnalisis
  ): Promise<any> {
    switch (tipoAnalisis) {
      case TipoAnalisis.ANALISIS_SENTENCIA:
        return await this.analizarSentencia(documento);
      case TipoAnalisis.ANALISIS_RESOLUCION:
        return await this.analizarResolucion(documento);
      case TipoAnalisis.CLASIFICACION_DOCUMENTO:
        return await this.clasificarDocumento(documento);
      default:
        throw new Error(`Tipo de análisis no soportado: ${tipoAnalisis}`);
    }
  }

  /**
   * Analiza una sentencia judicial
   */
  private async analizarSentencia(documento: any): Promise<any> {
    // Implementación: leer archivo, procesar con IA
    return {
      contenido: {
        tipoDocumento: "sentencia",
        juzgado: "Juzgado a determinar",
        fecha: new Date(),
        partes: {
          demandante: "Por extraer",
          demandado: "Por extraer",
        },
        decision: "Análisis en progreso",
        fundamentosLegales: [],
        argumentosPrincipales: [],
        recursosDisponibles: ["Apelación"],
      },
      palabrasClave: ["sentencia", "análisis"],
      puntajeConfianza: 0.8,
    };
  }

  /**
   * Analiza una resolución o auto judicial
   */
  private async analizarResolucion(documento: any): Promise<any> {
    return {
      contenido: {
        tipoDocumento: "resolucion",
        juzgado: "Juzgado a determinar",
        fecha: new Date(),
        asunto: "Por extraer",
        decision: "Por extraer",
        plazosCumplimiento: [],
        notificaciones: [],
      },
      palabrasClave: ["resolución", "análisis"],
      puntajeConfianza: 0.8,
    };
  }

  /**
   * Clasifica un documento automáticamente
   */
  private async clasificarDocumento(documento: any): Promise<any> {
    return {
      contenido: {
        tipoDocumento: "otro",
        materia: ["general"],
      },
      palabrasClave: ["clasificación"],
      puntajeConfianza: 0.75,
    };
  }

  /**
   * Extrae entidades del documento
   */
  private async extraerEntidades(
    contenido: ContenidoAnalisis
  ): Promise<EntidadExtraida[]> {
    const entidades: EntidadExtraida[] = [];

    // Extraer fechas
    if (contenido.fecha) {
      entidades.push({
        tipoEntidad: "fecha",
        valor: contenido.fecha.toISOString(),
        puntajeConfianza: 0.95,
      });
    }

    // Extraer partes
    if (contenido.partes) {
      if (contenido.partes.demandante) {
        entidades.push({
          tipoEntidad: "persona",
          valor: contenido.partes.demandante,
          puntajeConfianza: 0.85,
        });
      }
      if (contenido.partes.demandado) {
        entidades.push({
          tipoEntidad: "persona",
          valor: contenido.partes.demandado,
          puntajeConfianza: 0.85,
        });
      }
    }

    // Extraer juzgado
    if (contenido.juzgado) {
      entidades.push({
        tipoEntidad: "juzgado",
        valor: contenido.juzgado,
        puntajeConfianza: 0.90,
      });
    }

    return entidades;
  }

  /**
   * Analiza riesgos legales
   */
  private async analizarRiesgos(
    contenido: ContenidoAnalisis
  ): Promise<AnalisisRiesgo> {
    const factoresRiesgo: string[] = [];
    const factoresProtectores: string[] = [];
    let nivelRiesgo = NivelRiesgo.MEDIO;

    // Evaluar factores de riesgo
    if (contenido.decision && contenido.decision.toLowerCase().includes("condena")) {
      factoresRiesgo.push("Sentencia condenatoria identificada");
      nivelRiesgo = NivelRiesgo.ALTO;
    }

    if (contenido.recursosDisponibles && contenido.recursosDisponibles.length > 0) {
      factoresProtectores.push(
        `Recursos disponibles: ${contenido.recursosDisponibles.join(", ")}`
      );
    }

    return {
      nivelRiesgo,
      factoresRiesgo,
      factoresProtectores,
      recomendaciones: [
        {
          titulo: "Revisar plazo de recursos",
          descripcion: "Verificar que no haya vencido el plazo para interponer recursos",
          prioridad: "alta",
          plazo: "Inmediatamente",
        },
      ],
      apelabilidad: contenido.recursosDisponibles?.length ?? 0 > 0,
    };
  }

  /**
   * Genera resumen ejecutivo
   */
  private async generarResumen(contenido: ContenidoAnalisis): Promise<any> {
    return {
      titulo: `Análisis: ${contenido.tipoDocumento}`,
      resumenBreve: `Documento del juzgado ${contenido.juzgado} con fecha ${contenido.fecha}. Asunto: ${contenido.asunto || "No especificado"}`,
      puntosClaves: contenido.argumentosPrincipales || [],
      accionesRecomendadas: ["Revisar plazo de recursos", "Notificar a cliente"],
    };
  }

  /**
   * Obtiene análisis de un documento
   */
  async obtenerAnalisis(analisisId: string): Promise<ResultadoAnalisis | null> {
    const analisis = await prisma.analisisDocumento.findUnique({
      where: { id: analisisId },
      include: {
        entidadesExtraidas_rel: true,
      },
    });

    if (!analisis) return null;

    return this.formatearResultado(analisis);
  }

  /**
   * Busca documentos similares
   */
  async buscarDocumentosSimilares(documentoId: string, limite: number = 5) {
    const similares = await prisma.similitudDocumento.findMany({
      where: { documentoOrigenId: documentoId },
      orderBy: { puntajeSimilitud: "desc" },
      take: limite,
      include: {
        documentoSimilar: {
          include: {
            analisis: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return similares;
  }

  /**
   * Busca documentos por palabras clave
   */
  async buscarPorPalabraClave(
    palabraClave: string,
    pagina: number = 1,
    porPagina: number = 10
  ) {
    const skip = (pagina - 1) * porPagina;

    const analisis = await prisma.analisisDocumento.findMany({
      where: {
        OR: [
          { palabrasClave: { contains: palabraClave } },
          { contenidoAnalisis: { contains: palabraClave } },
          { resumen: { contains: palabraClave } },
        ],
      },
      include: { documento: true },
      skip,
      take: porPagina,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.analisisDocumento.count({
      where: {
        OR: [
          { palabrasClave: { contains: palabraClave } },
          { contenidoAnalisis: { contains: palabraClave } },
          { resumen: { contains: palabraClave } },
        ],
      },
    });

    return { analisis, total, pagina, porPagina };
  }

  /**
   * Obtiene historial de análisis de un documento
   */
  async obtenerHistorial(documentoId: string) {
    return await prisma.historialAnalisis.findMany({
      where: { documentoId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Formatea resultado para la respuesta API
   */
  private formatearResultado(analisis: any): ResultadoAnalisis {
    return {
      id: analisis.id,
      documentoId: analisis.documentoId,
      tipoAnalisis: analisis.tipoAnalisis,
      estado: analisis.estado,
      contenido: analisis.contenidoAnalisis
        ? JSON.parse(analisis.contenidoAnalisis)
        : {},
      entidadesExtraidas: analisis.entidadesExtraidas
        ? JSON.parse(analisis.entidadesExtraidas)
        : [],
      resumen: analisis.resumen ? JSON.parse(analisis.resumen) : null,
      analisisRiesgo: {
        nivelRiesgo: analisis.nivelRiesgo || NivelRiesgo.MEDIO,
        factoresRiesgo: [],
        factoresProtectores: [],
        recomendaciones: analisis.recomendaciones
          ? JSON.parse(analisis.recomendaciones)
          : [],
      },
      palabrasClave: analisis.palabrasClave
        ? JSON.parse(analisis.palabrasClave)
        : [],
      puntajeConfianza: analisis.puntajeConfianza || 0.8,
      createdAt: analisis.createdAt,
      updatedAt: analisis.updatedAt,
    };
  }
}

export const analisisService = new AnalisisDocumentoService();
