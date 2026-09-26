export default function Dashboard() {
  const stats = [
    { label: 'Expedientes Activos', value: 45, color: 'bg-blue-500' },
    { label: 'Procesos en Trámite', value: 23, color: 'bg-green-500' },
    { label: 'Alertas Pendientes', value: 8, color: 'bg-yellow-500' },
    { label: 'Documentos', value: 156, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-gray-900">Exp-001-2024</p>
              <p className="text-sm text-gray-600">Juzgado Civil</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium text-gray-900">Exp-002-2024</p>
              <p className="text-sm text-gray-600">Juzgado Laboral</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Próximas Audiencias</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Audiencia Exp-001</p>
                <p className="text-sm text-gray-600">28 de Septiembre, 2024</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Próxima</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
