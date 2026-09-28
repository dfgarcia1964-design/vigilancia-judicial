import { useState } from 'react'
import SkillAnalisisJuridico from '../components/SkillAnalisisJuridico'

export default function AnalisisJuridico() {
  const [documentoId, setDocumentoId] = useState('')
  const [contenido, setContenido] = useState('')

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentoId(e.target.value)
  }

  const handleContenidoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContenido(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚖️ Análisis Jurídico Riguroso</h1>
          <p className="text-gray-600">Análisis profundo de documentos legales aplicando estándares de integridad académica</p>
        </div>

        {/* Sección de entrada de documento */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">📥 Selecciona o Carga el Documento</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opción 1: Seleccionar de documentos existentes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar de Documentos Existentes
              </label>
              <select
                value={documentoId}
                onChange={handleDocumentoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Selecciona un documento --</option>
                <option value="doc1">Sentencia No. 001-2024</option>
                <option value="doc2">Resolución No. 002-2024</option>
                <option value="doc3">Contrato de Prestación de Servicios</option>
                <option value="doc4">Demanda Laboral</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">Selecciona un documento previo para análisis rápido</p>
            </div>

            {/* Opción 2: Pegar contenido directo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O Pega el Contenido Directamente
              </label>
              <textarea
                value={contenido}
                onChange={handleContenidoChange}
                placeholder="Pega aquí el contenido del documento legal..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-2">Puedes pegar cualquier texto legal para análisis inmediato</p>
            </div>
          </div>
        </div>

        {/* Componente de análisis jurídico */}
        {(documentoId || contenido) && (
          <SkillAnalisisJuridico
            documentoId={documentoId || 'custom'}
            contenidoDocumento={contenido || `Documento: ${documentoId}`}
          />
        )}

        {/* Información si no hay documento seleccionado */}
        {!documentoId && !contenido && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              👆 Selecciona un documento existente o pega contenido para comenzar el análisis
            </p>
          </div>
        )}

        {/* Información sobre el análisis */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ ¿Cómo usar el análisis jurídico?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Los 6 Objetivos del Análisis</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ <strong>Norma Aplicable:</strong> Identifica reglas jurídicas y antinomias</li>
                <li>✅ <strong>Hechos Jurídicos:</strong> Extrae información jurídicamente relevante</li>
                <li>✅ <strong>Subsunción TIPC:</strong> Estructura argumentativa completa</li>
                <li>✅ <strong>Consecuencias:</strong> Efectos legales según el rol</li>
                <li>✅ <strong>Coherencia:</strong> Valida la argumentación interna</li>
                <li>✅ <strong>Autoridad:</strong> Evalúa solidez y fuentes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Roles de Análisis</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>⚖️ <strong>Litigante:</strong> Pretensiones favorables y procedencia</li>
                <li>📋 <strong>Asesor:</strong> Predicción de riesgos y escenarios</li>
                <li>🏛️ <strong>Juez:</strong> Justificación coherente de decisiones</li>
                <li>📝 <strong>Contractual:</strong> Derechos, obligaciones y remedios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
