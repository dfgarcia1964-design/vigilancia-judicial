import React, { useState } from "react";
import "./SkillAnalisisJuridico.css";

interface AnalisisResultado {
  analisis: string;
  estructura?: {
    normaAplicable?: string;
    hechosRelevantes?: string[];
    argumentosPrincipales?: string[];
    consecuencias?: string[];
    fortalezas?: string[];
    debilidades?: string[];
    camposPendientes?: string[];
  };
  timestamp: string;
}

interface SkillAnalisisJuridicoProps {
  documentoId: string;
  contenidoDocumento?: string;
}

export const SkillAnalisisJuridico: React.FC<SkillAnalisisJuridicoProps> = ({
  documentoId,
  contenidoDocumento = "",
}) => {
  const [analisis, setAnalisis] = useState<AnalisisResultado | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoAnalisis, setTipoAnalisis] = useState<"completo" | "rapido" | "rol">(
    "completo"
  );
  const [rol, setRol] = useState<
    "litigante" | "asesor" | "juez" | "parte_contractual"
  >("asesor");
  const [pregunta, setPregunta] = useState("");
  const [vistaTab, setVistaTab] = useState<
    "completo" | "normas" | "hechos" | "consecuencias"
  >("completo");

  const realizarAnalisis = async () => {
    if (!contenidoDocumento && !documentoId) {
      setError("Se requiere contenido del documento");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      let endpoint = `/api/documents/${documentoId}/skill-analysis`;
      let body: any = {
        contenidoDocumento,
      };

      if (tipoAnalisis === "rapido") {
        endpoint += "/quick";
        body.pregunta = pregunta || "¿Cuál es el análisis jurídico?";
      } else if (tipoAnalisis === "rol") {
        endpoint += "/rol";
        body.rol = rol;
      } else {
        body.preguntaUsuario = pregunta;
        body.rol = rol;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.exito) {
        setAnalisis({
          analisis: data.dato.analisis || data.dato.resumen,
          estructura: data.dato.estructura,
          timestamp: new Date().toISOString(),
        });
        setVistaTab("completo");
      } else {
        setError(data.error || "Error en análisis");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const exportarAnalisis = async (formato: "txt" | "json") => {
    try {
      const response = await fetch(
        `/api/documents/${documentoId}/skill-analysis/export?formato=${formato}`,
        { method: "GET" }
      );

      if (formato === "json") {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        descargarArchivo(blob, `analisis-juridico-${documentoId}.json`);
      } else {
        const blob = await response.blob();
        descargarArchivo(blob, `analisis-juridico-${documentoId}.txt`);
      }
    } catch (err) {
      setError(`Error al exportar: ${(err as Error).message}`);
    }
  };

  const descargarArchivo = (blob: Blob, nombre: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="skill-analisis-juridico">
      <div className="header">
        <h2>⚖️ Análisis Jurídico Riguroso</h2>
        <p>
          Análisis profundo con 6 objetivos siguiendo estándares de integridad
        </p>
      </div>

      {/* Configuración de análisis */}
      <div className="configuracion">
        <div className="control-grupo">
          <label>Tipo de Análisis</label>
          <select
            value={tipoAnalisis}
            onChange={(e) =>
              setTipoAnalisis(
                e.target.value as "completo" | "rapido" | "rol"
              )
            }
          >
            <option value="completo">Completo (6 objetivos)</option>
            <option value="rapido">Rápido (Resumen)</option>
            <option value="rol">Por Rol del Usuario</option>
          </select>
        </div>

        {tipoAnalisis === "completo" && (
          <div className="control-grupo">
            <label>Pregunta Jurídica (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: ¿Es procedente la pretensión del demandante?"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
            />
          </div>
        )}

        {tipoAnalisis === "rapido" && (
          <div className="control-grupo">
            <label>Pregunta Específica</label>
            <input
              type="text"
              placeholder="Ej: ¿Cuáles son los riesgos legales?"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
            />
          </div>
        )}

        {(tipoAnalisis === "completo" || tipoAnalisis === "rol") && (
          <div className="control-grupo">
            <label>Rol del Usuario</label>
            <select
              value={rol}
              onChange={(e) =>
                setRol(
                  e.target.value as
                    | "litigante"
                    | "asesor"
                    | "juez"
                    | "parte_contractual"
                )
              }
            >
              <option value="litigante">Litigante (Pretensiones favorables)</option>
              <option value="asesor">Asesor (Predicción de riesgos)</option>
              <option value="juez">Juez (Justificación coherente)</option>
              <option value="parte_contractual">
                Parte Contractual (Derechos y obligaciones)
              </option>
            </select>
          </div>
        )}

        <button
          onClick={realizarAnalisis}
          disabled={cargando}
          className="btn-analizar"
        >
          {cargando ? "Analizando..." : "Realizar Análisis"}
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <div className="error-message">{error}</div>}

      {/* Resultado del análisis */}
      {analisis && (
        <div className="resultado">
          <div className="tabs">
            <button
              className={`tab ${vistaTab === "completo" ? "activo" : ""}`}
              onClick={() => setVistaTab("completo")}
            >
              Análisis Completo
            </button>
            {analisis.estructura?.normaAplicable && (
              <button
                className={`tab ${vistaTab === "normas" ? "activo" : ""}`}
                onClick={() => setVistaTab("normas")}
              >
                Normas Aplicables
              </button>
            )}
            {analisis.estructura?.hechosRelevantes && (
              <button
                className={`tab ${vistaTab === "hechos" ? "activo" : ""}`}
                onClick={() => setVistaTab("hechos")}
              >
                Hechos Relevantes
              </button>
            )}
            {analisis.estructura?.consecuencias && (
              <button
                className={`tab ${vistaTab === "consecuencias" ? "activo" : ""}`}
                onClick={() => setVistaTab("consecuencias")}
              >
                Consecuencias
              </button>
            )}
          </div>

          <div className="contenido-tab">
            {vistaTab === "completo" && (
              <div className="analisis-text">
                <pre>{analisis.analisis}</pre>
              </div>
            )}

            {vistaTab === "normas" && analisis.estructura?.normaAplicable && (
              <div className="seccion-normas">
                <h4>Normas Aplicables</h4>
                <p>{analisis.estructura.normaAplicable}</p>
              </div>
            )}

            {vistaTab === "hechos" && analisis.estructura?.hechosRelevantes && (
              <div className="seccion-hechos">
                <h4>Hechos Jurídicamente Relevantes</h4>
                <ul>
                  {analisis.estructura.hechosRelevantes.map(
                    (hecho, i) => (
                      <li key={i}>{hecho}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {vistaTab === "consecuencias" &&
              analisis.estructura?.consecuencias && (
                <div className="seccion-consecuencias">
                  <h4>Consecuencias Jurídicas</h4>
                  <ul>
                    {analisis.estructura.consecuencias.map(
                      (cons, i) => (
                        <li key={i}>{cons}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>

          {/* Botones de acción */}
          <div className="acciones">
            <button
              onClick={() => exportarAnalisis("txt")}
              className="btn-export"
            >
              📄 Descargar TXT
            </button>
            <button
              onClick={() => exportarAnalisis("json")}
              className="btn-export"
            >
              📋 Descargar JSON
            </button>
            <button
              onClick={() => {
                setAnalisis(null);
                setPregunta("");
              }}
              className="btn-reset"
            >
              🔄 Nuevo Análisis
            </button>
          </div>

          {/* Metadata */}
          <div className="metadata">
            <small>Análisis realizado: {new Date(analisis.timestamp).toLocaleString()}</small>
          </div>
        </div>
      )}

      {/* Información del skill */}
      <div className="info-skill">
        <h4>ℹ️ Sobre el Análisis Jurídico</h4>
        <ul>
          <li>✅ Identifica norma aplicable y antinomias</li>
          <li>✅ Extrae hechos jurídicamente relevantes</li>
          <li>✅ Construye argumentos TIPC (Tesis, Infracción, Prueba, Consecuencia)</li>
          <li>✅ Analiza consecuencias por rol específico</li>
          <li>✅ Valida coherencia interna del argumento</li>
          <li>✅ Evalúa autoridad argumentativa y solidez</li>
          <li>⚠️ Marca campos que requieren verificación</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillAnalisisJuridico;
