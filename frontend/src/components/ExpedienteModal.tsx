import { useState, useEffect } from 'react'
import { Expediente } from '../hooks/useExpedientes'

interface ExpedienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (datos: any) => Promise<void>
  expediente?: Expediente
  cargando?: boolean
}

const tiposExpediente = [
  'Laboral',
  'Civil',
  'Penal',
  'Administrativo',
  'Contencioso-Administrativo',
  'Constitucional',
  'Otros',
]

const estadosExpediente = [
  'En trámite',
  'En sentencia',
  'Sentenciado',
  'En apelación',
  'Cerrado',
  'Archivo',
]

export default function ExpedienteModal({
  isOpen,
  onClose,
  onSubmit,
  expediente,
  cargando = false,
}: ExpedienteModalProps) {
  const [formData, setFormData] = useState({
    numero: '',
    juzgado: '',
    demandante: '',
    demandado: '',
    asunto: '',
    tipo: '',
    estado: 'En trámite',
    fechaInicio: '',
  })

  useEffect(() => {
    if (expediente) {
      setFormData({
        numero: expediente.numero,
        juzgado: expediente.juzgado,
        demandante: expediente.demandante,
        demandado: expediente.demandado,
        asunto: expediente.asunto,
        tipo: expediente.tipo,
        estado: expediente.estado,
        fechaInicio: expediente.fechaInicio.split('T')[0],
      })
    } else {
      setFormData({
        numero: '',
        juzgado: '',
        demandante: '',
        demandado: '',
        asunto: '',
        tipo: '',
        estado: 'En trámite',
        fechaInicio: new Date().toISOString().split('T')[0],
      })
    }
  }, [expediente, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {expediente ? 'Editar Expediente' : 'Nuevo Expediente'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Expediente *
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={!!expediente}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Juzgado *
              </label>
              <input
                type="text"
                name="juzgado"
                value={formData.juzgado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Juzgado Civil Municipal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demandante *
              </label>
              <input
                type="text"
                name="demandante"
                value={formData.demandante}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demandado *
              </label>
              <input
                type="text"
                name="demandado"
                value={formData.demandado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Seleccionar tipo</option>
                {tiposExpediente.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {estadosExpediente.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asunto *
            </label>
            <textarea
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Descripción del asunto"
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
