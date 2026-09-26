import { z } from 'zod'

export const crearExpedienteSchema = z.object({
  numero: z.string().min(1, 'Número de expediente requerido').trim(),
  juzgado: z.string().min(1, 'Juzgado requerido').trim(),
  demandante: z.string().min(1, 'Demandante requerido').trim(),
  demandado: z.string().min(1, 'Demandado requerido').trim(),
  asunto: z.string().min(1, 'Asunto requerido').trim(),
  tipo: z.string().min(1, 'Tipo requerido').trim(),
  fechaInicio: z.string().datetime('Fecha de inicio inválida'),
})

export const actualizarExpedienteSchema = crearExpedienteSchema.partial()

export const expedienteQuerySchema = z.object({
  estado: z.string().optional(),
  tipo: z.string().optional(),
  juzgado: z.string().optional(),
})

export const buscarExpedienteSchema = z.object({
  q: z.string().min(1, 'Parámetro de búsqueda requerido').trim(),
})

export type CrearExpediente = z.infer<typeof crearExpedienteSchema>
export type ActualizarExpediente = z.infer<typeof actualizarExpedienteSchema>
export type ExpedienteQuery = z.infer<typeof expedienteQuerySchema>
export type BuscarExpediente = z.infer<typeof buscarExpedienteSchema>
