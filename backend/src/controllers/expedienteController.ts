import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const crearExpediente = async (req: Request, res: Response) => {
  try {
    const { numero, juzgado, demandante, demandado, asunto, tipo, fechaInicio } = req.body
    const usuarioId = (req as any).userId

    if (!numero || !juzgado || !demandante || !demandado || !asunto || !tipo || !fechaInicio) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    const expedienteExistente = await prisma.expediente.findUnique({
      where: { numero },
    })

    if (expedienteExistente) {
      return res.status(400).json({ error: 'El número de expediente ya existe' })
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

    res.status(201).json({
      message: 'Expediente creado exitosamente',
      expediente,
    })
  } catch (error) {
    console.error('Error al crear expediente:', error)
    res.status(500).json({ error: 'Error al crear expediente' })
  }
}

export const obtenerExpedientes = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).userId
    const { estado, tipo, juzgado } = req.query

    const donde: any = { usuarioId }

    if (estado) donde.estado = estado
    if (tipo) donde.tipo = tipo
    if (juzgado) donde.juzgado = { contains: juzgado as string, mode: 'insensitive' }

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
  } catch (error) {
    console.error('Error al obtener expedientes:', error)
    res.status(500).json({ error: 'Error al obtener expedientes' })
  }
}

export const obtenerExpediente = async (req: Request, res: Response) => {
  try {
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
      return res.status(404).json({ error: 'Expediente no encontrado' })
    }

    res.json(expediente)
  } catch (error) {
    console.error('Error al obtener expediente:', error)
    res.status(500).json({ error: 'Error al obtener expediente' })
  }
}

export const actualizarExpediente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const usuarioId = (req as any).userId
    const { numero, juzgado, demandante, demandado, asunto, estado, tipo, fechaInicio } = req.body

    const expediente = await prisma.expediente.findFirst({
      where: { id, usuarioId },
    })

    if (!expediente) {
      return res.status(404).json({ error: 'Expediente no encontrado' })
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
  } catch (error) {
    console.error('Error al actualizar expediente:', error)
    res.status(500).json({ error: 'Error al actualizar expediente' })
  }
}

export const eliminarExpediente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const usuarioId = (req as any).userId

    const expediente = await prisma.expediente.findFirst({
      where: { id, usuarioId },
    })

    if (!expediente) {
      return res.status(404).json({ error: 'Expediente no encontrado' })
    }

    await prisma.expediente.delete({
      where: { id },
    })

    res.json({ message: 'Expediente eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar expediente:', error)
    res.status(500).json({ error: 'Error al eliminar expediente' })
  }
}

export const buscarExpedientes = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).userId
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' })
    }

    const expedientes = await prisma.expediente.findMany({
      where: {
        usuarioId,
        OR: [
          { numero: { contains: q as string, mode: 'insensitive' } },
          { asunto: { contains: q as string, mode: 'insensitive' } },
          { demandante: { contains: q as string, mode: 'insensitive' } },
          { demandado: { contains: q as string, mode: 'insensitive' } },
          { juzgado: { contains: q as string, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      total: expedientes.length,
      resultados: expedientes,
    })
  } catch (error) {
    console.error('Error en búsqueda de expedientes:', error)
    res.status(500).json({ error: 'Error en búsqueda de expedientes' })
  }
}
