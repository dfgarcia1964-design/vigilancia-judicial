export default function Procesos() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Procesos Administrativos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Proceso Administrativo</h3>
          <p className="text-sm text-gray-600 mb-4">Gestión de procesos ante entidades públicas</p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            Crear Proceso
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Recursos</h3>
          <p className="text-sm text-gray-600 mb-4">Seguimiento de recursos y apelaciones</p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            Ver Recursos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Respuestas</h3>
          <p className="text-sm text-gray-600 mb-4">Respuestas de entidades públicas</p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            Ver Respuestas
          </button>
        </div>
      </div>
    </div>
  )
}
