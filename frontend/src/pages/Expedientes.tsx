import { useState, useEffect } from 'react'
import { useExpedientes, Expediente } from '../hooks/useExpedientes'
import ExpedienteModal from '../components/ExpedienteModal'

export default function Expedientes() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<Expediente | undefined>()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const {
    expedientes,
    cargando,
    error,
    obtenerExpedientes,
    crearExpediente,
    actualizarExpediente,
    eliminarExpediente,
    isCreating,
    isUpdating,
  } = useExpedientes()

  useEffect(() => {
    obtenerExpedientes()
  }, [])

  const handleAbrirModal = (expediente?: Expediente) => {
    setExpedienteSeleccionado(expediente)
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setExpedienteSeleccionado(undefined)
  }

  const handleSubmit = async (datos: any) => {
    try {
      if (expedienteSeleccionado) {
        await actualizarExpediente(expedienteSeleccionado.id, datos)
      } else {
        await crearExpediente(datos)
      }
      handleCerrarModal()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleEliminar = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este expediente?')) {
      try {
        await eliminarExpediente(id)
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }

  const expedientesFiltrados = expedientes.filter((exp) => {
    const coincideBusqueda =
      exp.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.demandante.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado = !filtroEstado || exp.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Expedientes</h2>
        <button
          onClick={() => handleAbrirModal()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Nuevo Expediente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Número, asunto, demandante..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="En trámite">En trámite</option>
              <option value="En sentencia">En sentencia</option>
              <option value="Sentenciado">Sentenciado</option>
              <option value="En apelación">En apelación</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              Total: <span className="font-bold text-lg">{expedientesFiltrados.length}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-500">
            Cargando expedientes...
          </div>
        ) : expedientesFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay expedientes para mostrar
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Número</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Juzgado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Demandante</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expedientesFiltrados.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{exp.numero}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exp.tipo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exp.juzgado}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exp.demandante}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exp.estado === 'En trámite' ? 'bg-blue-100 text-blue-800' :
                      exp.estado === 'En sentencia' ? 'bg-yellow-100 text-yellow-800' :
                      exp.estado === 'Sentenciado' ? 'bg-green-100 text-green-800' :
                      exp.estado === 'En apelación' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exp.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleAbrirModal(exp)}
                      className="text-primary hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(exp.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ExpedienteModal
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleSubmit}
        expediente={expedienteSeleccionado}
        cargando={isCreating || isUpdating}
      />
    </div>
  )
}
