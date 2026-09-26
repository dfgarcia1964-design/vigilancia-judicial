import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/apiClient'

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
  error: Error | null
  obtenerProcesos: (filtros?: any) => void
  obtenerProceso: (id: string) => Promise<Proceso>
  crearProceso: (datos: Omit<Proceso, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => Promise<Proceso>
  actualizarProceso: (id: string, datos: Partial<Proceso>) => Promise<Proceso>
  eliminarProceso: (id: string) => Promise<void>
  buscar: (q: string) => Promise<Proceso[]>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

interface ProcesoFilters {
  estado?: string
  tipo?: string
  expedienteId?: string
}

const PROCESOS_QUERY_KEY = ['procesos']

export const useProcesos = (filtrosInicial?: ProcesoFilters): UseProcesosReturn => {
  const queryClient = useQueryClient()
  const [filtros, setFiltros] = React.useState<ProcesoFilters>(filtrosInicial || {})

  const buildQueryKey = () => [...PROCESOS_QUERY_KEY, filtros]

  const { data: procesos = [], isPending, error } = useQuery({
    queryKey: buildQueryKey(),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filtros.estado) params.append('estado', filtros.estado)
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      if (filtros.expedienteId) params.append('expedienteId', filtros.expedienteId)

      const response = await api.get(`/procesos?${params.toString()}`)
      return response.data.procesos
    },
  })

  const crearMutation = useMutation({
    mutationFn: async (datos: Omit<Proceso, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/procesos', datos)
      return response.data.proceso
    },
    onSuccess: (nuevoProceso) => {
      queryClient.setQueryData(buildQueryKey(), (old: Proceso[] = []) => [
        nuevoProceso,
        ...old,
      ])
    },
  })

  const actualizarMutation = useMutation({
    mutationFn: async ({ id, datos }: { id: string; datos: Partial<Proceso> }) => {
      const response = await api.put(`/procesos/${id}`, datos)
      return response.data.proceso
    },
    onSuccess: (procesoActualizado) => {
      queryClient.setQueryData(buildQueryKey(), (old: Proceso[] = []) =>
        old.map((proc) => (proc.id === procesoActualizado.id ? procesoActualizado : proc))
      )
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/procesos/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(buildQueryKey(), (old: Proceso[] = []) =>
        old.filter((proc) => proc.id !== id)
      )
    },
  })

  return {
    procesos,
    cargando: isPending,
    error: error as Error | null,
    obtenerProcesos: (nuevosFiltros?: ProcesoFilters) => {
      if (nuevosFiltros) setFiltros(nuevosFiltros)
    },
    obtenerProceso: async (id: string) => {
      const response = await api.get(`/procesos/${id}`)
      return response.data
    },
    crearProceso: (datos) => crearMutation.mutateAsync(datos),
    actualizarProceso: (id, datos) => actualizarMutation.mutateAsync({ id, datos }),
    eliminarProceso: (id) => eliminarMutation.mutateAsync(id),
    buscar: async (q: string) => {
      const response = await api.get(`/procesos/buscar?q=${q}`)
      return response.data.resultados
    },
    isCreating: crearMutation.isPending,
    isUpdating: actualizarMutation.isPending,
    isDeleting: eliminarMutation.isPending,
  }
}
