import { useEffect, useState } from 'react'
import { useExpedientes } from '../hooks/useExpedientes'

export default function Dashboard() {
  const { expedientes, obtenerExpedientes, cargando } = useExpedientes()
  const [stats, setStats] = useState({
    total: 0,
    enTramite: 0,
    enSentencia: 0,
    cerrados: 0,
  })

  useEffect(() => {
    obtenerExpedientes()
  }, [])

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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

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
    </div>
  )
}
