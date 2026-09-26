import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'
import logger from '../lib/logger.js'

export const crearExpediente = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { numero, juzgado, demandante, demandado, asunto, tipo, fechaInicio } = req.body
  const usuarioId = (req as any).userId

  logger.info('Creando expediente', { numero, usuarioId })

  if (!numero || !juzgado || !demandante || !demandado || !asunto || !tipo || !fechaInicio) {
    throw new AppError(400, 'Todos los campos son requeridos')
  }

  const expedienteExistente = await prisma.expediente.findUnique({
    where: { numero },
  })

  if (expedienteExistente) {
    logger.warn('Intento de crear expediente duplicado', { numero })
    throw new AppError(400, 'El número de expediente ya existe')
  }

  const expediente = await prisma.expediente.create({
    data: {
      numero,
      juzgado,
      demandante,
      demandado,
      asunto,
      tipo,
      fechaInicio: new Date(fechaInicio),
      usuarioId,
    },
  })

  logger.info('Expediente creado', { expedienteId: expediente.id, numero })

  res.status(201).json({
    message: 'Expediente creado exitosamente',
    expediente,
  })
})

export const obtenerExpedientes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const usuarioId = (req as any).userId
  const { estado, tipo, juzgado } = req.query

  const donde: any = { usuarioId }

  if (estado) donde.estado = estado
  if (tipo) donde.tipo = tipo
  if (juzgado) donde.juzgado = { contains: juzgado as string }

  const expedientes = await prisma.expediente.findMany({
    where: donde,
    orderBy: { createdAt: 'desc' },
    include: {
      audiencias: true,
      alertas: true,
    },
  })

  res.json({
    total: expedientes.length,
    expedientes,
  })
})

export const obtenerExpediente = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const usuarioId = (req as any).userId

  const expediente = await prisma.expediente.findFirst({
    where: { id, usuarioId },
    include: {
      documentos: true,
      audiencias: true,
      alertas: true,
      procesos: true,
    },
  })

  if (!expediente) {
    throw new AppError(404, 'Expediente no encontrado')
  }

  res.json(expediente)
})

export const actualizarExpediente = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const usuarioId = (req as any).userId
  const { numero, juzgado, demandante, demandado, asunto, estado, tipo, fechaInicio } = req.body

  const expediente = await prisma.expediente.findFirst({
    where: { id, usuarioId },
  })

  if (!expediente) {
    throw new AppError(404, 'Expediente no encontrado')
  }

  const expedienteActualizado = await prisma.expediente.update({
    where: { id },
    data: {
      ...(numero && { numero }),
      ...(juzgado && { juzgado }),
      ...(demandante && { demandante }),
      ...(demandado && { demandado }),
      ...(asunto && { asunto }),
      ...(estado && { estado }),
      ...(tipo && { tipo }),
      ...(fechaInicio && { fechaInicio: new Date(fechaInicio) }),
    },
    include: {
      audiencias: true,
      alertas: true,
    },
  })

  res.json({
    message: 'Expediente actualizado exitosamente',
    expediente: expedienteActualizado,
  })
})

export const eliminarExpediente = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const usuarioId = (req as any).userId

  logger.info('Eliminando expediente', { expedienteId: id, usuarioId })

  const expediente = await prisma.expediente.findFirst({
    where: { id, usuarioId },
  })

  if (!expediente) {
    logger.warn('Intento de eliminar expediente no encontrado', { expedienteId: id })
    throw new AppError(404, 'Expediente no encontrado')
  }

  await prisma.expediente.delete({
    where: { id },
  })

  logger.info('Expediente eliminado', { expedienteId: id })

  res.json({ message: 'Expediente eliminado exitosamente' })
})

export const buscarExpedientes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const usuarioId = (req as any).userId
  const { q } = req.query

  if (!q) {
    throw new AppError(400, 'Parámetro de búsqueda requerido')
  }

  const expedientes = await prisma.expediente.findMany({
    where: {
      usuarioId,
      OR: [
        { numero: { contains: q as string } },
        { asunto: { contains: q as string } },
        { demandante: { contains: q as string } },
        { demandado: { contains: q as string } },
        { juzgado: { contains: q as string } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    total: expedientes.length,
    resultados: expedientes,
  })
})
