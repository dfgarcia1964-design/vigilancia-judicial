import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import expedientesRoutes from './routes/expedientes.js'
import procesosRoutes from './routes/procesos.js'
import env from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/logger.js'
import logger from './lib/logger.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.SOCKET_IO_ORIGIN,
    methods: ['GET', 'POST'],
  },
})

app.use(helmet())
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}))

app.use(requestLogger)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static frontend files
const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath))

app.use('/api/auth', authRoutes)
app.use('/api/expedientes', expedientesRoutes)
app.use('/api/procesos', procesosRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' })
})

app.get('/api/stats', (req, res) => {
  res.json({
    expedientes: 45,
    procesos: 23,
    alertas: 8,
    documentos: 156,
  })
})

// Serve index.html for all non-API routes (React Router support)
app.get('*', (req, res, next) => {
  // Only serve index.html for GET requests
  if (req.method !== 'GET') return next()
  res.sendFile(path.join(publicPath, 'index.html'))
})

io.on('connection', (socket) => {
  logger.info(`Cliente conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`)
  })

  socket.on('nueva-alerta', (data) => {
    logger.info('Nueva alerta recibida', { socketId: socket.id, data })
    io.emit('alerta-recibida', data)
  })
})

app.use(errorHandler)

export default httpServer
