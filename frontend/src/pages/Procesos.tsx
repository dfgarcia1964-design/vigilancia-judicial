import { useState, useEffect } from 'react'
import { useProcesos, Proceso } from '../hooks/useProcesos'
import ProcesoModal from '../components/ProcesoModal'

export default function Procesos() {
  const { procesos, cargando, error, obtenerProcesos, crearProceso, actualizarProceso, eliminarProceso } = useProcesos()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<Proceso | undefined>()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  useEffect(() => {
    obtenerProcesos()
  }, [])

  const handleAbrirModal = (proceso?: Proceso) => {
    setProcesoSeleccionado(proceso)
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setProcesoSeleccionado(undefined)
  }

  const handleSubmit = async (datos: any) => {
    try {
      if (procesoSeleccionado) {
        await actualizarProceso(procesoSeleccionado.id, datos)
      } else {
        await crearProceso(datos)
      }
      handleCerrarModal()
      obtenerProcesos()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleEliminar = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proceso?')) {
      try {
        await eliminarProceso(id)
        obtenerProcesos()
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }

  const procesosFiltrados = procesos.filter((proc) => {
    const coincideBusqueda =
      proc.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      proc.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      proc.entidad.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado = !filtroEstado || proc.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'en_tramite':
        return 'bg-blue-100 text-blue-800'
      case 'respondido':
        return 'bg-green-100 text-green-800'
      case 'apelado':
        return 'bg-yellow-100 text-yellow-800'
      case 'resuelto':
        return 'bg-purple-100 text-purple-800'
      case 'cerrado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'en_tramite':
        return 'En Trámite'
      case 'respondido':
        return 'Respondido'
      case 'apelado':
        return 'Apelado'
      case 'resuelto':
        return 'Resuelto'
      case 'cerrado':
        return 'Cerrado'
      default:
        return estado
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Procesos Administrativos</h2>
        <button
          onClick={() => handleAbrirModal()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Nuevo Proceso
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
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
              placeholder="Número, asunto, entidad..."
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
              <option value="en_tramite">En Trámite</option>
              <option value="respondido">Respondido</option>
              <option value="apelado">Apelado</option>
              <option value="resuelto">Resuelto</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              Total: <span className="font-bold text-lg">{procesosFiltrados.length}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-500">
            Cargando procesos...
          </div>
        ) : procesosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay procesos para mostrar
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Radicado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Entidad</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Asunto</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {procesosFiltrados.map((proc) => (
                <tr key={proc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{proc.numero}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proc.tipo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{proc.entidad}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{proc.asunto}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(proc.estado)}`}>
                      {getEstadoLabel(proc.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleAbrirModal(proc)}
                      className="text-primary hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(proc.id)}
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

      <ProcesoModal
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleSubmit}
        proceso={procesoSeleccionado}
        cargando={cargando}
      />
    </div>
  )
}
