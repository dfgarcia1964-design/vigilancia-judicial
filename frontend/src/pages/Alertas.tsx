export default function Alertas() {
  const alertas = [
    { id: 1, tipo: 'Audiencia', mensaje: 'Audiencia agendada para Exp-001', fecha: '28/09/2024', prioridad: 'alta' },
    { id: 2, tipo: 'Sentencia', mensaje: 'Sentencia publicada en Exp-002', fecha: '26/09/2024', prioridad: 'media' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Alertas y Notificaciones</h2>

      <div className="space-y-4">
        {alertas.map((alerta) => (
          <div key={alerta.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{alerta.tipo}</h3>
                <p className="text-gray-600">{alerta.mensaje}</p>
                <p className="text-sm text-gray-500 mt-2">{alerta.fecha}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                alerta.prioridad === 'alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {alerta.prioridad.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
