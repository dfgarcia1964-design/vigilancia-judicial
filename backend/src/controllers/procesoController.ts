import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'

export const crearProceso = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { numero, entidad, asunto, tipo, expedienteId } = req.body
  const usuarioId = (req as any).userId

  if (!numero || !entidad || !asunto || !tipo) {
    throw new AppError(400, 'Campos requeridos: numero, entidad, asunto, tipo')
  }

  const proceso = await prisma.proceso.create({
    data: {
      numero,
      entidad,
      asunto,
      tipo,
      estado: 'en_tramite',
      usuarioId,
      ...(expedienteId && { expedienteId }),
    },
  })

  res.status(201).json({
    message: 'Proceso creado exitosamente',
    proceso,
  })
})

export const obtenerProcesos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const usuarioId = (req as any).userId
  const { estado, tipo, expedienteId } = req.query

  const donde: any = { usuarioId }
  if (estado) donde.estado = estado
  if (tipo) donde.tipo = tipo
  if (expedienteId) donde.expedienteId = expedienteId

  const procesos = await prisma.proceso.findMany({
    where: donde,
    orderBy: { createdAt: 'desc' },
    include: {
      recursos: true,
      respuestas: true,
    },
  })

  res.json({
    total: procesos.length,
    procesos,
  })
})

export const obtenerProceso = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const usuarioId = (req as any).userId

  const proceso = await prisma.proceso.findFirst({
    where: { id, usuarioId },
    include: {
      recursos: true,
      respuestas: true,
      alertas: true,
    },
  })

  if (!proceso) {
    throw new AppError(404, 'Proceso no encontrado')
  }

  res.json(proceso)
})

export const actualizarProceso = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const usuarioId = (req as any).userId
  const { numero, entidad, asunto, estado, tipo } = req.body

  const proceso = await prisma.proceso.findFirst({
    where: { id, usuarioId },
  })

  if (!proceso) {
    throw new AppError(404, 'Proceso no encontrado')
  }

  const procesoActualizado = await prisma.proceso.update({
    where: { id },
    data: {
      ...(numero && { numero }),
      ...(entidad && { entidad }),
      ...(asunto && { asunto }),
      ...(estado && { estado }),
      ...(tipo && { tipo }),
    },
  })

  res.json({
    message: 'Proceso actualizado exitosamente',
    proceso: procesoActualizado,
  })
})

export const eliminarProceso = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const usuarioId = (req as any).userId

  const proceso = await prisma.proceso.findFirst({
    where: { id, usuarioId },
  })

  if (!proceso) {
    throw new AppError(404, 'Proceso no encontrado')
  }

  await prisma.proceso.delete({
    where: { id },
  })

  res.json({ message: 'Proceso eliminado exitosamente' })
})

export const buscarProcesos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const usuarioId = (req as any).userId
  const { q } = req.query

  if (!q) {
    throw new AppError(400, 'Parámetro de búsqueda requerido')
  }

  const procesos = await prisma.proceso.findMany({
    where: {
      usuarioId,
      OR: [
        { numero: { contains: q as string } },
        { asunto: { contains: q as string } },
        { entidad: { contains: q as string } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    total: procesos.length,
    resultados: procesos,
  })
})
