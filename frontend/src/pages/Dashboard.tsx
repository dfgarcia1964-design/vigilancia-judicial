import { useEffect, useState } from 'react'
import { useExpedientes } from '../hooks/useExpedientes'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { expedientes, obtenerExpedientes, cargando } = useExpedientes()
  const navigate = useNavigate()
  const [showQuickStart, setShowQuickStart] = useState(false)
  const [quickForm, setQuickForm] = useState({
    numero: '',
    juzgado: '',
    demandante: '',
    demandado: '',
    tipo: 'Civil',
    estado: 'En trámite',
    fechaInicio: new Date().toISOString().split('T')[0],
    asunto: '',
  })
  const [stats, setStats] = useState({
    total: 0,
    enTramite: 0,
    enSentencia: 0,
    cerrados: 0,
  })

  useEffect(() => {
    obtenerExpedientes()
  }, [])

  const handleQuickStart = async (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/expedientes')
    setShowQuickStart(false)
  }

  useEffect(() => {
    const enTramite = expedientes.filter((e) => e.estado === 'En trámite').length
    const enSentencia = expedientes.filter((e) => e.estado === 'En sentencia').length
    const cerrados = expedientes.filter((e) => e.estado === 'Cerrado').length

    setStats({
      total: expedientes.length,
      enTramite,
      enSentencia,
      cerrados,
    })
  }, [expedientes])

  const statItems = [
    { label: 'Expedientes Totales', value: stats.total, color: 'bg-blue-500' },
    { label: 'En Trámite', value: stats.enTramite, color: 'bg-green-500' },
    { label: 'En Sentencia', value: stats.enSentencia, color: 'bg-yellow-500' },
    { label: 'Cerrados', value: stats.cerrados, color: 'bg-purple-500' },
  ]

  const expedientesRecientes = expedientes.slice(0, 5)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => setShowQuickStart(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition flex items-center gap-2"
        >
          <span>⚡ Inicio Rápido</span>
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-8 text-gray-500">Cargando datos...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4`}></div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expedientes Recientes</h3>
              {expedientesRecientes.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay expedientes aún</p>
              ) : (
                <div className="space-y-4">
                  {expedientesRecientes.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium text-gray-900">{exp.numero}</p>
                      <p className="text-sm text-gray-600">{exp.juzgado}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(exp.fechaInicio).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Distribución por Estado</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">En Trámite</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${stats.total > 0 ? (stats.enTramite / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.enTramite}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">En Sentencia</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${stats.total > 0 ? (stats.enSentencia / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.enSentencia}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cerrados</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${stats.total > 0 ? (stats.cerrados / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.cerrados}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showQuickStart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">⚡ Inicio Rápido</h3>
              <button
                onClick={() => setShowQuickStart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickStart}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Expediente
                  </label>
                  <input
                    type="text"
                    value={quickForm.numero}
                    onChange={(e) => setQuickForm({ ...quickForm, numero: e.target.value })}
                    placeholder="Ej: 2024-CV-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demandante
                  </label>
                  <input
                    type="text"
                    value={quickForm.demandante}
                    onChange={(e) => setQuickForm({ ...quickForm, demandante: e.target.value })}
                    placeholder="Nombre del demandante"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demandado
                  </label>
                  <input
                    type="text"
                    value={quickForm.demandado}
                    onChange={(e) => setQuickForm({ ...quickForm, demandado: e.target.value })}
                    placeholder="Nombre del demandado"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <textarea
                    value={quickForm.asunto}
                    onChange={(e) => setQuickForm({ ...quickForm, asunto: e.target.value })}
                    placeholder="Descripción breve del asunto"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-800 mb-2 font-medium">💡 Nota:</p>
                  <p className="text-xs text-indigo-700">
                    Completa los campos básicos aquí y luego podrás agregar más detalles en la sección de Expedientes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickStart(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                >
                  Ir a Expedientes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
