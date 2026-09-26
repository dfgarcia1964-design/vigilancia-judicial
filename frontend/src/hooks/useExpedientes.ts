import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/apiClient'

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
  error: Error | null
  obtenerExpedientes: (filtros?: any) => void
  obtenerExpediente: (id: string) => Promise<Expediente>
  crearExpediente: (datos: Omit<Expediente, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => Promise<Expediente>
  actualizarExpediente: (id: string, datos: Partial<Expediente>) => Promise<Expediente>
  eliminarExpediente: (id: string) => Promise<void>
  buscar: (q: string) => Promise<Expediente[]>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

interface ExpedienteFilters {
  estado?: string
  tipo?: string
  juzgado?: string
}

const EXPEDIENTES_QUERY_KEY = ['expedientes']

export const useExpedientes = (filtrosInicial?: ExpedienteFilters): UseExpedientesReturn => {
  const queryClient = useQueryClient()
  const [filtros, setFiltros] = React.useState<ExpedienteFilters>(filtrosInicial || {})

  const buildQueryKey = () => [...EXPEDIENTES_QUERY_KEY, filtros]

  const { data: expedientes = [], isPending, error } = useQuery({
    queryKey: buildQueryKey(),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filtros.estado) params.append('estado', filtros.estado)
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      if (filtros.juzgado) params.append('juzgado', filtros.juzgado)

      const response = await api.get(`/expedientes?${params.toString()}`)
      return response.data.expedientes
    },
  })

  const crearMutation = useMutation({
    mutationFn: async (datos: Omit<Expediente, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/expedientes', datos)
      return response.data.expediente
    },
    onSuccess: (nuevoExpediente) => {
      queryClient.setQueryData(buildQueryKey(), (old: Expediente[] = []) => [
        nuevoExpediente,
        ...old,
      ])
    },
  })

  const actualizarMutation = useMutation({
    mutationFn: async ({ id, datos }: { id: string; datos: Partial<Expediente> }) => {
      const response = await api.put(`/expedientes/${id}`, datos)
      return response.data.expediente
    },
    onSuccess: (expedienteActualizado) => {
      queryClient.setQueryData(buildQueryKey(), (old: Expediente[] = []) =>
        old.map((exp) => (exp.id === expedienteActualizado.id ? expedienteActualizado : exp))
      )
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/expedientes/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(buildQueryKey(), (old: Expediente[] = []) =>
        old.filter((exp) => exp.id !== id)
      )
    },
  })

  return {
    expedientes,
    cargando: isPending,
    error: error as Error | null,
    obtenerExpedientes: (nuevosFiltros?: ExpedienteFilters) => {
      if (nuevosFiltros) setFiltros(nuevosFiltros)
    },
    obtenerExpediente: async (id: string) => {
      const response = await api.get(`/expedientes/${id}`)
      return response.data
    },
    crearExpediente: (datos) => crearMutation.mutateAsync(datos),
    actualizarExpediente: (id, datos) => actualizarMutation.mutateAsync({ id, datos }),
    eliminarExpediente: (id) => eliminarMutation.mutateAsync(id),
    buscar: async (q: string) => {
      const response = await api.get(`/expedientes/buscar?q=${q}`)
      return response.data.resultados
    },
    isCreating: crearMutation.isPending,
    isUpdating: actualizarMutation.isPending,
    isDeleting: eliminarMutation.isPending,
  }
}
