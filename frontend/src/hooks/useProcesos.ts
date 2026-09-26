import { useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export interface Proceso {
  id: string
  numero: string
  entidad: string
  asunto: string
  estado: string
  tipo: string
  expedienteId?: string
  usuarioId: string
  createdAt: string
  updatedAt: string
}

interface UseProcesosReturn {
  procesos: Proceso[]
  cargando: boolean
  error: string | null
  obtenerProcesos: (filtros?: any) => Promise<void>
  obtenerProceso: (id: string) => Promise<Proceso>
  crearProceso: (datos: Omit<Proceso, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => Promise<Proceso>
  actualizarProceso: (id: string, datos: Partial<Proceso>) => Promise<Proceso>
  eliminarProceso: (id: string) => Promise<void>
  buscar: (q: string) => Promise<Proceso[]>
}

const API_URL = 'http://localhost:5000/api/procesos'

export const useProcesos = (): UseProcesosReturn => {
  const [procesos, setProcesos] = useState<Proceso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthStore()

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const obtenerProcesos = async (filtros?: any) => {
    setCargando(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filtros?.estado) params.append('estado', filtros.estado)
      if (filtros?.tipo) params.append('tipo', filtros.tipo)

      const response = await axios.get(
        `${API_URL}?${params.toString()}`,
        getAxiosConfig()
      )
      setProcesos(response.data.procesos)
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al obtener procesos'
      setError(mensaje)
      console.error('Error:', err)
    } finally {
      setCargando(false)
    }
  }

  const obtenerProceso = async (id: string): Promise<Proceso> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAxiosConfig())
      return response.data
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al obtener proceso'
      setError(mensaje)
      throw err
    }
  }

  const crearProceso = async (datos: Omit<Proceso, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>): Promise<Proceso> => {
    setCargando(true)
    setError(null)
    try {
      const response = await axios.post(API_URL, datos, getAxiosConfig())
      const nuevoProceso = response.data.proceso
      setProcesos([nuevoProceso, ...procesos])
      return nuevoProceso
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al crear proceso'
      setError(mensaje)
      throw err
    } finally {
      setCargando(false)
    }
  }

  const actualizarProceso = async (id: string, datos: Partial<Proceso>): Promise<Proceso> => {
    setCargando(true)
    setError(null)
    try {
      const response = await axios.put(`${API_URL}/${id}`, datos, getAxiosConfig())
      const procesoActualizado = response.data.proceso
      setProcesos(
        procesos.map((proc) => (proc.id === id ? procesoActualizado : proc))
      )
      return procesoActualizado
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al actualizar proceso'
      setError(mensaje)
      throw err
    } finally {
      setCargando(false)
    }
  }

  const eliminarProceso = async (id: string): Promise<void> => {
    setCargando(true)
    setError(null)
    try {
      await axios.delete(`${API_URL}/${id}`, getAxiosConfig())
      setProcesos(procesos.filter((proc) => proc.id !== id))
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al eliminar proceso'
      setError(mensaje)
      throw err
    } finally {
      setCargando(false)
    }
  }

  const buscar = async (q: string): Promise<Proceso[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/buscar?q=${q}`,
        getAxiosConfig()
      )
      return response.data.resultados
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error en búsqueda'
      setError(mensaje)
      throw err
    }
  }

  return {
    procesos,
    cargando,
    error,
    obtenerProcesos,
    obtenerProceso,
    crearProceso,
    actualizarProceso,
    eliminarProceso,
    buscar,
  }
}
