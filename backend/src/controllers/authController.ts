import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma.js'
import env from '../config/env.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, nombre, apellido, password, passwordConfirm } = req.body

  if (!email || !nombre || !apellido || !password || !passwordConfirm) {
    throw new AppError(400, 'Todos los campos son requeridos')
  }

  if (password !== passwordConfirm) {
    throw new AppError(400, 'Las contraseñas no coinciden')
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  })

  if (usuarioExistente) {
    throw new AppError(400, 'El email ya está registrado')
  }

  const hashedPassword = await bcryptjs.hash(password, 10)

  const usuario = await prisma.usuario.create({
    data: {
      email,
      nombre,
      apellido,
      password: hashedPassword,
    },
  })

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
    },
  })
})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError(400, 'Email y contraseña son requeridos')
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  })

  if (!usuario) {
    throw new AppError(401, 'Credenciales inválidas')
  }

  const passwordValida = await bcryptjs.compare(password, usuario.password)

  if (!passwordValida) {
    throw new AppError(401, 'Credenciales inválidas')
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    message: 'Login exitoso',
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
    },
  })
})

export const me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      rol: true,
      activo: true,
    },
  })

  if (!usuario) {
    throw new AppError(404, 'Usuario no encontrado')
  }

  res.json(usuario)
})

export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Logout exitoso' })
}
