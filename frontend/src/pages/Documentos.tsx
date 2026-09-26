export default function Documentos() {
  const documentos = [
    { id: 1, nombre: 'Demanda Exp-001', tipo: 'PDF', fecha: '15/09/2024', expediente: 'Exp-001-2024' },
    { id: 2, nombre: 'Auto Juzgado', tipo: 'PDF', fecha: '20/09/2024', expediente: 'Exp-002-2024' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Documentos</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
          + Subir Documento
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Expediente</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documentos.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">📄 {doc.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.tipo}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.expediente}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.fecha}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline">Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
