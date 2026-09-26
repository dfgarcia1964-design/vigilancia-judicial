import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { AppError } from './errorHandler.js'

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params

      const validated = schema.parse(data)

      if (source === 'body') {
        req.body = validated
      } else if (source === 'query') {
        req.query = validated as any
      } else {
        req.params = validated as any
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ')
        return next(new AppError(400, `Validación fallida: ${messages}`))
      }
      next(error)
    }
  }
}
