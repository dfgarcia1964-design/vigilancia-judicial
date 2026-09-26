import { z } from 'zod'

export const crearProcesoSchema = z.object({
  numero: z.string().min(1, 'Número de proceso requerido').trim(),
  entidad: z.string().min(1, 'Entidad requerida').trim(),
  asunto: z.string().min(1, 'Asunto requerido').trim(),
  tipo: z.string().min(1, 'Tipo requerido').trim(),
  expedienteId: z.string().optional(),
})

export const actualizarProcesoSchema = crearProcesoSchema.partial()

export const procesoQuerySchema = z.object({
  estado: z.string().optional(),
  tipo: z.string().optional(),
  expedienteId: z.string().optional(),
})

export const buscarProcesoSchema = z.object({
  q: z.string().min(1, 'Parámetro de búsqueda requerido').trim(),
})

export type CrearProceso = z.infer<typeof crearProcesoSchema>
export type ActualizarProceso = z.infer<typeof actualizarProcesoSchema>
export type ProcesoQuery = z.infer<typeof procesoQuerySchema>
export type BuscarProceso = z.infer<typeof buscarProcesoSchema>
