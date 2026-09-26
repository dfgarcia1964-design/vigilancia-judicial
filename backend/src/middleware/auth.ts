import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import { AppError } from './errorHandler.js'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return next(new AppError(401, 'Token no proporcionado'))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    req.userId = decoded.id
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, 'Token expirado'))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, 'Token inválido'))
    }
    return next(new AppError(401, 'Error al verificar token'))
  }
}
