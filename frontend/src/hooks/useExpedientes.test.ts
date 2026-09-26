import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExpedientes } from './useExpedientes'
import { api } from '../lib/apiClient'
import React from 'react'

vi.mock('../lib/apiClient')

describe('useExpedientes Hook', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)

  it('should initialize with empty expedientes', () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { expedientes: [] },
    } as any)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    expect(result.current.expedientes).toEqual([])
    expect(result.current.cargando).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should fetch expedientes successfully', async () => {
    const mockExpedientes = [
      {
        id: '1',
        numero: 'EXP-001',
        juzgado: 'Juzgado Civil',
        demandante: 'Juan',
        demandado: 'Pedro',
        asunto: 'Divorcio',
        estado: 'en_tramite',
        tipo: 'Civil',
        fechaInicio: '2026-01-01',
        usuarioId: 'user1',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]

    vi.mocked(api.get).mockResolvedValue({
      data: { expedientes: mockExpedientes },
    } as any)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    result.current.obtenerExpedientes()

    await waitFor(() => {
      expect(result.current.expedientes).toHaveLength(1)
      expect(result.current.expedientes[0].numero).toBe('EXP-001')
    })
  })

  it('should handle fetch error', async () => {
    const error = new Error('Network error')
    vi.mocked(api.get).mockRejectedValue(error)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    result.current.obtenerExpedientes()

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })

  it('should create expediente successfully', async () => {
    const newExpediente = {
      numero: 'EXP-002',
      juzgado: 'Juzgado Penal',
      demandante: 'Maria',
      demandado: 'Carlos',
      asunto: 'Homicidio',
      tipo: 'Penal',
      fechaInicio: '2026-02-01',
    }

    const createdExpediente = {
      id: '2',
      ...newExpediente,
      usuarioId: 'user1',
      estado: 'en_tramite',
      createdAt: '2026-02-01',
      updatedAt: '2026-02-01',
    }

    vi.mocked(api.post).mockResolvedValue({
      data: { expediente: createdExpediente },
    } as any)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    const created = await result.current.crearExpediente(newExpediente as any)

    expect(created.id).toBe('2')
    expect(created.numero).toBe('EXP-002')
  })

  it('should delete expediente successfully', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: {} } as any)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    await result.current.eliminarExpediente('1')

    expect(api.delete).toHaveBeenCalledWith('/expedientes/1')
  })

  it('should search expedientes', async () => {
    const searchResults = [
      {
        id: '1',
        numero: 'EXP-001',
        juzgado: 'Juzgado',
        demandante: 'Test',
        demandado: 'User',
        asunto: 'Test Case',
        estado: 'en_tramite',
        tipo: 'Civil',
        fechaInicio: '2026-01-01',
        usuarioId: 'user1',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]

    vi.mocked(api.get).mockResolvedValue({
      data: { resultados: searchResults },
    } as any)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    const results = await result.current.buscar('test')

    expect(results).toHaveLength(1)
    expect(results[0].numero).toBe('EXP-001')
  })
})
