export default function Expedientes() {
  const expedientes = [
    { id: 1, numero: 'Exp-001-2024', juzgado: 'Juzgado Civil', demandante: 'Juan Pérez', estado: 'En trámite' },
    { id: 2, numero: 'Exp-002-2024', juzgado: 'Juzgado Laboral', demandante: 'María García', estado: 'En sentencia' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Expedientes</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
          + Nuevo Expediente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Número</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Juzgado</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Demandante</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expedientes.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{exp.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exp.juzgado}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exp.demandante}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {exp.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
