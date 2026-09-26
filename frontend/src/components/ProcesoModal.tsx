import { useState, useEffect } from 'react'
import { Proceso } from '../hooks/useProcesos'

interface ProcesoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (datos: any) => Promise<void>
  proceso?: Proceso
  cargando?: boolean
}

const tiposProceso = [
  'Derechos de Petición',
  'Acción de Tutela',
  'Habeas Corpus',
  'Habeas Data',
  'Reparación Directa',
  'Nulidad',
  'Apelación',
  'Recurso',
  'Otros',
]

const estadosProceso = [
  'en_tramite',
  'respondido',
  'apelado',
  'resuelto',
  'cerrado',
]

export default function ProcesoModal({
  isOpen,
  onClose,
  onSubmit,
  proceso,
  cargando = false,
}: ProcesoModalProps) {
  const [formData, setFormData] = useState({
    numero: '',
    entidad: '',
    asunto: '',
    tipo: '',
    estado: 'en_tramite',
  })

  useEffect(() => {
    if (proceso) {
      setFormData({
        numero: proceso.numero,
        entidad: proceso.entidad,
        asunto: proceso.asunto,
        tipo: proceso.tipo,
        estado: proceso.estado,
      })
    } else {
      setFormData({
        numero: '',
        entidad: '',
        asunto: '',
        tipo: '',
        estado: 'en_tramite',
      })
    }
  }, [proceso, isOpen])

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
            {proceso ? 'Editar Proceso' : 'Nuevo Proceso Administrativo'}
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
                Número de Radicado *
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: 2024-001"
                required
                disabled={!!proceso}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entidad *
              </label>
              <input
                type="text"
                name="entidad"
                value={formData.entidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Ministerio del Interior"
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
                {tiposProceso.map((tipo) => (
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
                <option value="en_tramite">En Trámite</option>
                <option value="respondido">Respondido</option>
                <option value="apelado">Apelado</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
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
              placeholder="Descripción del proceso"
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
