import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import expedientesRoutes from './routes/expedientes.js'
import procesosRoutes from './routes/procesos.js'
import env from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

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

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

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

io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id)

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id)
  })

  socket.on('nueva-alerta', (data) => {
    io.emit('alerta-recibida', data)
  })
})

app.use(errorHandler)

export default httpServer
