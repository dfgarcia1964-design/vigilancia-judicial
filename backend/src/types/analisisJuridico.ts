// Tipos para Análisis Jurídico Profundo

export interface NormaAplicable {
  nivel: "constitucional" | "legal" | "jurisprudencial" | "regulatorio";
  referencia: string; // Ej: "Art. 25 Constitución Política"
  descripcion: string;
  vigencia: boolean;
  estado: "verificada" | "verificar" | "alto_riesgo";
  antinomias?: string[]; // Conflictos normativos
  resolucion?: string; // Cómo se resuelve el conflicto
}

export interface HechoJuridico {
  descripcion: string;
  relevancia: "alta" | "media" | "baja";
  supuestoNormativo: string; // Qué norma lo regula
  vaciosProbaltorios?: string[]; // Información faltante
}

export interface ArgumenoTIPC {
  tesis: string; // Afirmación jurídica central
  infraccion: {
    norma: string;
    cita: string;
    descripcion: string;
  };
  prueba: string; // Evidencia del documento
  consecuencia: string; // Lo que debe ocurrir
  solidez: "fuerte" | "media" | "débil";
}

export interface ArgumentoDistincion {
  precedenteInvocado: string;
  razonDistincion: string;
  diferenciasFacticas: string[];
  ratioDividendi: string;
  resultado: string;
}

export interface SubsuncionAnalisis {
  tipo: "subsuncion" | "distincion";
  argumentos: (ArgumenoTIPC | ArgumentoDistincion)[];
  coherenciaInterna: {
    esCoherente: boolean;
    contradicciones?: string[];
    saltoLogico?: string;
  };
  objecionMasLfuerte: {
    descripcion: string;
    respuesta: string;
  };
}

export interface ConsecuenciaJuridica {
  rol: "litigante" | "asesor" | "juez" | "parte_contractual";
  consecuencia: string;
  pretensiones?: string[];
  riesgos?: {
    descripcion: string;
    probabilidad: "alto" | "medio" | "bajo";
  }[];
  remedios?: string[]; // Acciones disponibles
  justificacion: string;
}

export interface AutoridadArgumentativa {
  fuentesNormativas: NormaAplicable[];
  fuentesJurisprudenciales: {
    numero?: string;
    tribunal: string;
    fecha: string;
    tema: string;
    estado: "verificada" | "verificar" | "alto_riesgo";
  }[];
  solidezArgumento: {
    nivel: "muy_solido" | "solido" | "moderado" | "debil";
    fortalezas: string[];
    vulnerabilidades: string[];
  };
}

export interface AnalisisJuridico {
  documentoId: string;
  tipoDocumento: string;
  preguntaJuridica: string; // Explícita o inferida

  // Los 6 objetivos
  normaAplicable: NormaAplicable[];
  hechosJuridicos: HechoJuridico[];
  subsuncionAnalisis: SubsuncionAnalisis;
  consecuenciasJuridicas: ConsecuenciaJuridica[];
  coherenciaControl: {
    premisasSustentan: boolean;
    explicacion: string;
    contradiccionesDetectadas?: string[];
  };
  autoridadArgumentativa: AutoridadArgumentativa;

  // Metadatos
  resumen: string;
  camposPendientes: {
    tipo: "verificar" | "dato_faltante" | "revisar";
    descripcion: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export interface SolicitudAnalisisJuridico {
  documentoId: string;
  preguntaJuridica?: string; // Opcional, se infiere si no se proporciona
  rolUsuario?: "litigante" | "asesor" | "juez" | "parte_contractual";
  profundidad?: "basica" | "media" | "profunda";
}

export interface RespuestaAnalisisJuridico {
  exito: boolean;
  mensaje: string;
  dato?: AnalisisJuridico;
  error?: string;
  camposPendientes?: string[];
}
