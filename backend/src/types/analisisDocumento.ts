// Tipos para Análisis de Documentos

export enum TipoAnalisis {
  ANALISIS_SENTENCIA = "sentence_analysis",
  ANALISIS_RESOLUCION = "resolution_analysis",
  CLASIFICACION_DOCUMENTO = "document_classification",
  EXTRACCION_ENTIDADES = "entity_extraction",
}

export enum TipoDocumento {
  SENTENCIA = "sentencia",
  RESOLUCION = "resolucion",
  AUTO = "auto",
  DEMANDA = "demanda",
  ESCRITO = "escrito",
  ACTA = "acta",
  CERTIFICADO = "certificado",
  OTRO = "otro",
}

export enum EstadoAnalisis {
  PENDIENTE = "pendiente",
  EN_PROCESO = "en_proceso",
  COMPLETADO = "completado",
  ERROR = "error",
}

export enum NivelRiesgo {
  BAJO = "bajo",
  MEDIO = "medio",
  ALTO = "alto",
}

export enum TipoEntidad {
  PERSONA = "persona",
  ORGANIZACION = "organizacion",
  FECHA = "fecha",
  MONTO = "monto",
  LUGAR = "lugar",
  JUZGADO = "juzgado",
  RADICADO = "radicado",
  RECURSO = "recurso",
}

export interface EntidadExtraida {
  tipoEntidad: TipoEntidad;
  valor: string;
  puntajeConfianza?: number;
  posicionInicio?: number;
  posicionFin?: number;
  contexto?: string;
}

export interface Partes {
  demandante?: string;
  demandado?: string;
  terceros?: string[];
  apoderados?: string[];
}

export interface RecomendacionAccion {
  titulo: string;
  descripcion: string;
  prioridad: "baja" | "media" | "alta";
  plazo?: string;
  responsable?: string;
}

export interface ContenidoAnalisis {
  tipoDocumento: TipoDocumento;
  juzgado?: string;
  radicado?: string;
  fecha?: Date;
  partes?: Partes;
  materia?: string[];
  asunto?: string;
  decision?: string;
  fundamentosLegales?: string[];
  argumentosPrincipales?: string[];
  precedentesJurisprudenciales?: string[];
  plazosCumplimiento?: string[];
  recursosDisponibles?: string[];
  notificaciones?: string[];
  observaciones?: string;
}

export interface AnalisisRiesgo {
  nivelRiesgo: NivelRiesgo;
  factoresRiesgo: string[];
  factoresProtectores: string[];
  recomendaciones: RecomendacionAccion[];
  apelabilidad?: boolean;
  probabilidadExito?: number;
}

export interface ResumenEjecutivo {
  titulo: string;
  resumenBreve: string;
  puntosClaves: string[];
  accionesRecomendadas: string[];
}

export interface ResultadoAnalisis {
  id: string;
  documentoId: string;
  tipoAnalisis: TipoAnalisis;
  estado: EstadoAnalisis;
  contenido: ContenidoAnalisis;
  entidadesExtraidas: EntidadExtraida[];
  resumen: ResumenEjecutivo;
  analisisRiesgo: AnalisisRiesgo;
  palabrasClave: string[];
  puntajeConfianza: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SolicitudAnalisisDocumento {
  documentoId: string;
  tipoAnalisis: TipoAnalisis;
  opciones?: {
    extraerEntidades?: boolean;
    analizarRiesgos?: boolean;
    buscarSimilares?: boolean;
    generarResumen?: boolean;
  };
}

export interface ResultadoBusqueda {
  documentos: {
    id: string;
    nombre: string;
    relevancia: number;
    resumen: string;
  }[];
  totalResultados: number;
  pagina: number;
  porPagina: number;
}

export interface DocumentoSimilar {
  id: string;
  nombre: string;
  puntajeSimilitud: number;
  razon: string;
  analisisRelacionado?: {
    tipoDocumento?: string;
    materia?: string[];
    juzgado?: string;
  };
}

export interface RespuestaApiAnalisis {
  exito: boolean;
  mensaje: string;
  dato?: ResultadoAnalisis | ResultadoBusqueda | DocumentoSimilar[];
  error?: string;
}
