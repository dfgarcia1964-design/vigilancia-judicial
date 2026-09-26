import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const crearProceso = async (req: Request, res: Response) => {
  try {
    const { numero, entidad, asunto, tipo, expedienteId } = req.body
    const usuarioId = (req as any).userId

    if (!numero || !entidad || !asunto || !tipo) {
      return res.status(400).json({ error: 'Campos requeridos: numero, entidad, asunto, tipo' })
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
  } catch (error) {
    console.error('Error al crear proceso:', error)
    res.status(500).json({ error: 'Error al crear proceso' })
  }
}

export const obtenerProcesos = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Error al obtener procesos:', error)
    res.status(500).json({ error: 'Error al obtener procesos' })
  }
}

export const obtenerProceso = async (req: Request, res: Response) => {
  try {
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
      return res.status(404).json({ error: 'Proceso no encontrado' })
    }

    res.json(proceso)
  } catch (error) {
    console.error('Error al obtener proceso:', error)
    res.status(500).json({ error: 'Error al obtener proceso' })
  }
}

export const actualizarProceso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const usuarioId = (req as any).userId
    const { numero, entidad, asunto, estado, tipo } = req.body

    const proceso = await prisma.proceso.findFirst({
      where: { id, usuarioId },
    })

    if (!proceso) {
      return res.status(404).json({ error: 'Proceso no encontrado' })
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
  } catch (error) {
    console.error('Error al actualizar proceso:', error)
    res.status(500).json({ error: 'Error al actualizar proceso' })
  }
}

export const eliminarProceso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const usuarioId = (req as any).userId

    const proceso = await prisma.proceso.findFirst({
      where: { id, usuarioId },
    })

    if (!proceso) {
      return res.status(404).json({ error: 'Proceso no encontrado' })
    }

    await prisma.proceso.delete({
      where: { id },
    })

    res.json({ message: 'Proceso eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar proceso:', error)
    res.status(500).json({ error: 'Error al eliminar proceso' })
  }
}

export const buscarProcesos = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).userId
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' })
    }

    const procesos = await prisma.proceso.findMany({
      where: {
        usuarioId,
        OR: [
          { numero: { contains: q as string, mode: 'insensitive' } },
          { asunto: { contains: q as string, mode: 'insensitive' } },
          { entidad: { contains: q as string, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      total: procesos.length,
      resultados: procesos,
    })
  } catch (error) {
    console.error('Error en búsqueda de procesos:', error)
    res.status(500).json({ error: 'Error en búsqueda de procesos' })
  }
}
