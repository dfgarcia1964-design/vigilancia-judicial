import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger.js'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const { method, url, ip } = req

  res.on('finish', () => {
    const duration = Date.now() - startTime
    const { statusCode } = res

    const logData = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userId: (req as any).userId || 'anonymous',
    }

    if (statusCode >= 500) {
      logger.error(`[${method}] ${url}`, logData)
    } else if (statusCode >= 400) {
      logger.warn(`[${method}] ${url}`, logData)
    } else {
      logger.info(`[${method}] ${url}`, logData)
    }
  })

  next()
}
