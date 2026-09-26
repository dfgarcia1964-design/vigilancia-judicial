import { useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export interface Expediente {
  id: string
  numero: string
  juzgado: string
  demandante: string
  demandado: string
  asunto: string
  estado: string
  tipo: string
  fechaInicio: string
  usuarioId: string
  createdAt: string
  updatedAt: string
}

interface UseExpedientesReturn {
  expedientes: Expediente[]
  cargando: boolean
  error: string | null
  obtenerExpedientes: (filtros?: any) => Promise<void>
  obtenerExpediente: (id: string) => Promise<Expediente>
  crearExpediente: (datos: Omit<Expediente, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => Promise<Expediente>
  actualizarExpediente: (id: string, datos: Partial<Expediente>) => Promise<Expediente>
  eliminarExpediente: (id: string) => Promise<void>
  buscar: (q: string) => Promise<Expediente[]>
}

const API_URL = 'http://localhost:5000/api/expedientes'

export const useExpedientes = (): UseExpedientesReturn => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthStore()

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const obtenerExpedientes = async (filtros?: any) => {
    setCargando(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filtros?.estado) params.append('estado', filtros.estado)
      if (filtros?.tipo) params.append('tipo', filtros.tipo)
      if (filtros?.juzgado) params.append('juzgado', filtros.juzgado)

      const response = await axios.get(
        `${API_URL}?${params.toString()}`,
        getAxiosConfig()
      )
      setExpedientes(response.data.expedientes)
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al obtener expedientes'
      setError(mensaje)
      console.error('Error:', err)
    } finally {
      setCargando(false)
    }
  }

  const obtenerExpediente = async (id: string): Promise<Expediente> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAxiosConfig())
      return response.data
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al obtener expediente'
      setError(mensaje)
      throw err
    }
  }

  const crearExpediente = async (datos: Omit<Expediente, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>): Promise<Expediente> => {
    setCargando(true)
    setError(null)
    try {
      const response = await axios.post(API_URL, datos, getAxiosConfig())
      const nuevoExpediente = response.data.expediente
      setExpedientes([nuevoExpediente, ...expedientes])
      return nuevoExpediente
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al crear expediente'
      setError(mensaje)
      throw err
    } finally {
      setCargando(false)
    }
  }

  const actualizarExpediente = async (id: string, datos: Partial<Expediente>): Promise<Expediente> => {
    setCargando(true)
    setError(null)
    try {
      const response = await axios.put(`${API_URL}/${id}`, datos, getAxiosConfig())
      const expedienteActualizado = response.data.expediente
      setExpedientes(
        expedientes.map((exp) => (exp.id === id ? expedienteActualizado : exp))
      )
      return expedienteActualizado
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al actualizar expediente'
      setError(mensaje)
      throw err
    } finally {
      setCargando(false)
    }
  }

  const eliminarExpediente = async (id: string): Promise<void> => {
    setCargando(true)
    setError(null)
    try {
      await axios.delete(`${API_URL}/${id}`, getAxiosConfig())
      setExpedientes(expedientes.filter((exp) => exp.id !== id))
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error al eliminar expediente'
      setError(mensaje)
      throw err
    } finally {
      setCargando(false)
    }
  }

  const buscar = async (q: string): Promise<Expediente[]> => {
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
    expedientes,
    cargando,
    error,
    obtenerExpedientes,
    obtenerExpediente,
    crearExpediente,
    actualizarExpediente,
    eliminarExpediente,
    buscar,
  }
}
