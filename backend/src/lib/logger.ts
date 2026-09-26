import winston from 'winston'
import env from '../config/env.js'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const ts = `[${timestamp}]`
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : ''
    return `${ts} [${level}] ${message}${metaStr}`
  })
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.uncolorize(),
  }),
  new winston.transports.File({
    filename: 'logs/all.log',
    format: winston.format.uncolorize(),
  }),
]

const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  levels,
  format,
  transports,
})

export default logger
